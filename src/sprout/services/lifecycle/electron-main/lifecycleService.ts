/*
 * @Author: pikun
 * @Date: 2019-12-08 11:00:12
 * @LastEditTime: 2019-12-09 14:58:11
 * @Description:
 */
import { ipcMain as ipc, app } from 'electron';
import { Event, Emitter } from 'sprout/base/common/event';
import { createDecorator } from 'sprout/instantiation/instantiation';
import { ICodeWindow } from 'sprout/services/windows/electron-main/windows';
import { Disposable } from 'sprout/base/common/lifecycle';
import { Barrier } from 'sprout/base/common/async';
import { isMacintosh, isWindows } from 'sprout/base/common/platform';
import { handleVetos } from 'sprout/services/lifecycle/common/lifecycle';
import { FuncRunningLog, runError } from 'sprout/base/utils/log';
import { IPC_EVENT } from 'sprout/constants/ipcEvent';
export const ILifecycleService = createDecorator<ILifecycleService>('lifecycleService');
export const enum UnloadReason {
	CLOSE = 1,
	QUIT = 2,
	RELOAD = 3,
	LOAD = 4
}
export interface IWindowUnloadEvent {
	window: ICodeWindow;
 	reason: UnloadReason;
	veto(value: boolean | Promise<boolean>): void;
}

export interface ShutdownEvent {

	/**
	 * Allows to join the shutdown. The promise can be a long running operation but it
	 * will block the application from closing.
	 */
	join(promise: Promise<void>): void;
}



export interface ILifecycleService {

	_serviceBrand: undefined;

	/**
	 * Will be true if the program was restarted (e.g. due to explicit request or update).
	 */
	readonly wasRestarted: boolean;

	/**
	 * Will be true if the program was requested to quit.
	 */
	readonly quitRequested: boolean;

	/**
	 * A flag indicating in what phase of the lifecycle we currently are.
	 */
	phase: LifecycleMainPhase;

	/**
	 * An event that fires when the application is about to shutdown before any window is closed.
	 * The shutdown can still be prevented by any window that vetos this event.
	 */
	readonly onBeforeShutdown: Event<void>;

	/**
	 * An event that fires after the onBeforeShutdown event has been fired and after no window has
	 * vetoed the shutdown sequence. At this point listeners are ensured that the application will
	 * quit without veto.
	 */
	readonly onWillShutdown: Event<ShutdownEvent>;

	/**
	 * An event that fires before a window closes. This event is fired after any veto has been dealt
	 * with so that listeners know for sure that the window will close without veto.
	 */
	readonly onBeforeWindowClose: Event<ICodeWindow>;

	/**
	 * An event that fires before a window is about to unload. Listeners can veto this event to prevent
	 * the window from unloading.
	 */
	readonly onBeforeWindowUnload: Event<IWindowUnloadEvent>;

	/**
	 * Unload a window for the provided reason. All lifecycle event handlers are triggered.
	 */
	unload(window: ICodeWindow, reason: UnloadReason): Promise<boolean /* veto */>;

	/**
	 * Restart the application with optional arguments (CLI). All lifecycle event handlers are triggered.
	 */
	relaunch(options?: { addArgs?: string[], removeArgs?: string[] }): void;

	/**
	 * Shutdown the application normally. All lifecycle event handlers are triggered.
	 */
	quit(fromUpdate?: boolean): Promise<boolean /* veto */>;

	/**
	 * Forcefully shutdown the application. No livecycle event handlers are triggered.
	 */
	kill(code?: number): void;

	/**
	 * Returns a promise that resolves when a certain lifecycle phase
	 * has started.
	 */
	when(phase: LifecycleMainPhase): Promise<void>;
}


export const enum LifecycleMainPhase {

	/**
	 * The first phase signals that we are about to startup.
	 */
	Starting = 1,

	/**
	 * Services are ready and first window is about to open.
	 */
	Ready = 2,

	/**
	 * This phase signals a point in time after the window has opened
	 * and is typically the best place to do work that is not required
	 * for the window to open.
	 */
	AfterWindowOpen = 3
}


export class LifecycleService extends Disposable implements ILifecycleService {
	_serviceBrand: undefined;
	private windowCounter = 0;

	private pendingWillShutdownPromise: Promise<void> | null = null; // 当在退出中的时候，不再执行退出操作

	private pendingQuitPromise: Promise<boolean> | null = null;
	private pendingQuitPromiseResolve: { (veto: boolean): void } | null = null;

	private windowToCloseRequest: Set<number> = new Set(); // 需要关闭的窗口集合

	private oneTimeListenerTokenGenerator = 0; // 用于单次通信的随机数

	private _wasRestarted: boolean = false;
	get wasRestarted(): boolean { return this._wasRestarted; }

	private _quitRequested = false;
	get quitRequested(): boolean { return this._quitRequested; }

	private _phase: LifecycleMainPhase = LifecycleMainPhase.Starting;
	get phase(): LifecycleMainPhase { return this._phase; }

	private readonly _onBeforeShutdown = this._register(new Emitter<void>());
	readonly onBeforeShutdown: Event<void> = this._onBeforeShutdown.event;

	private readonly _onWillShutdown = this._register(new Emitter<ShutdownEvent>());
	readonly onWillShutdown: Event<ShutdownEvent> = this._onWillShutdown.event;

	private readonly _onBeforeWindowClose = this._register(new Emitter<ICodeWindow>());
	readonly onBeforeWindowClose: Event<ICodeWindow> = this._onBeforeWindowClose.event;

	private readonly _onBeforeWindowUnload = this._register(new Emitter<IWindowUnloadEvent>());
	readonly onBeforeWindowUnload: Event<IWindowUnloadEvent> = this._onBeforeWindowUnload.event;

	private phaseWhen = new Map<LifecycleMainPhase, Barrier>();

	constructor() {
		super();
		this.when(LifecycleMainPhase.Ready).then(() => this.registerListeners());
	}

	private registerListeners(): void {

		app.addListener('before-quit', () => this.beforeQuitListener);

		app.addListener('window-all-closed', this.windowAllClosedListener);

		app.once('will-quit', this.willQuitListener);
	}

	@FuncRunningLog
	private windowAllClosedListener() {
		app.quit();
	}

	@FuncRunningLog
	private beforeQuitListener() {
		if (this._quitRequested) {
			return;
		}
		this._quitRequested = true;
		this._onBeforeShutdown.fire();

		// macOS: can run without any window open. in that case we fire
		// the onWillShutdown() event directly because there is no veto
		// to be expected.
		if (isMacintosh && this.windowCounter === 0) {
			this.beginOnWillShutdown();
		}
	}

	@FuncRunningLog
	private beginOnWillShutdown(): Promise<void> {
		if(this.pendingWillShutdownPromise) {
			return this.pendingWillShutdownPromise;
		}

		const joiners: Promise<void>[] = [];// 发出事件，搜集在结束前其余地方可能需要做什么，都放入joiners里一起做
		this._onWillShutdown.fire({
			join(promise) {
				if(promise) {
					joiners.push(promise);
				}
			}
		});
		this.pendingWillShutdownPromise = Promise.all(joiners).then(() => undefined, runError);
		return this.pendingWillShutdownPromise;
	}

	set phase(value: LifecycleMainPhase) {
		if (value < this.phase) {
			throw new Error('Lifecycle cannot go backwards');
		}

		if (this._phase === value) {
			return;
		}

		this._phase = value;

		const barrier = this.phaseWhen.get(this._phase);
		if (barrier) {
			barrier.open();
			this.phaseWhen.delete(this._phase);
		}
	}


	private willQuitListener(e: any) {
		e.preventDefault();
		const shutdownPromise = this.beginOnWillShutdown();
		shutdownPromise.finally(() => {
			app.removeListener('before-quit', this.beforeQuitListener);
			app.removeListener('window-all-closed', this.windowAllClosedListener);
			app.quit();
		});
	}

	/**
	 *
	 * @param window
	 * 新打开窗口的时候需要在生命周期里注册窗口，用于窗口管理
	 */
	public registerWindow(window: ICodeWindow): void {
		this.windowCounter++;
		window.win.on('close', e => this.windowCloseListener(e, window));
		window.win.on('closed', this.windowClosedListener)
	}

	private windowClosedListener() {
		this.windowCounter--;
		if (this.windowCounter === 0) {
			this.beginOnWillShutdown();
		}
	}

	private windowCloseListener(e, window: ICodeWindow) {
			const windowId = window.id;
			// 关闭，则清理id
			if (this.windowToCloseRequest.has(windowId)) {
				this.windowToCloseRequest.delete(windowId);
				return;
			}

			e.preventDefault();
			this.unload(window, UnloadReason.CLOSE).then((veto: boolean) => {
				if (veto) {
					// 否定关闭，则不关闭此窗口
					this.windowToCloseRequest.delete(windowId);
					return;
				}
				this.windowToCloseRequest.add(windowId); // set重复添加会忽略，因此不做判断
				this._onBeforeWindowClose.fire(window);

				// No veto, close window now
				window.close();
			});
	}

	/**
	 *
	 * @param window
	 * @param reason
	 * 去渲染进程、主进程里分别确认是否可以unload窗口
	 */
	async unload(window: ICodeWindow, reason: UnloadReason): Promise<boolean /* veto */> {
		if (!window.isReady) {
			return Promise.resolve(false);
		}

		// first ask the window itself if it vetos the unload
		const windowUnloadReason = this._quitRequested ? UnloadReason.QUIT : reason;
		// veto 表示是否否决关闭窗口，true，则表示不否决关闭窗口，即执行关闭窗口。=>渲染进程投票
		let veto = await this.onBeforeUnloadWindowInRenderer(window, windowUnloadReason);
		if(veto) {
			return this.handleWindowUnloadVeto(veto);
		}

		veto = await this.onBeforeUnloadWindowInMain(window, windowUnloadReason);
		if(veto) {
			return this.handleWindowUnloadVeto(veto);
		}

		await this.onWillUnloadWindowInRenderer(window, windowUnloadReason);

		return false;

	}

	private onWillUnloadWindowInRenderer(window: ICodeWindow, reason: UnloadReason): Promise<void> {
		return new Promise<void>(resolve => {
			const oneTimeEventToken = this.oneTimeListenerTokenGenerator++;
			const replyChannel = IPC_EVENT.ON_WILL_UNLOAD_REPLY(oneTimeEventToken);
			ipc.once(replyChannel, () => resolve());
			window.send(IPC_EVENT.ON_WILL_UNLOAD, { replyChannel, reason });
		});
	}

	private onBeforeUnloadWindowInMain(window: ICodeWindow, reason: UnloadReason): Promise<boolean /* veto */> {
		const vetos: (boolean | Promise<boolean>)[] = [];

		this._onBeforeWindowUnload.fire({
			reason,
			window,
			veto(value) {
				vetos.push(value);
			}
		});

		return handleVetos(vetos, err => runError);
	}

	private handleWindowUnloadVeto(veto: boolean): boolean {
		if (!veto) { return false; }
		// a veto resolves any pending quit with veto
		this.resolvePendingQuitPromise(true /* veto */);

		// a veto resets the pending quit request flag
		this._quitRequested = false;

		return true; // veto
	}

	private resolvePendingQuitPromise(veto: boolean): void {
		if (this.pendingQuitPromiseResolve) {
			this.pendingQuitPromiseResolve(veto);
			this.pendingQuitPromiseResolve = null;
			this.pendingQuitPromise = null;
		}
	}

	private onBeforeUnloadWindowInRenderer(window: ICodeWindow, reason: UnloadReason): Promise<boolean /* veto */> {
		return new Promise<boolean>(resolve => {
			const oneTimeEventToken = this.oneTimeListenerTokenGenerator++;
			const okChannel = IPC_EVENT.ON_CLOSE_WINDOW_OK(oneTimeEventToken);
			const cancelChannel = IPC_EVENT.ON_CLOSE_WINDOW_CANCEL(oneTimeEventToken);

			ipc.once(okChannel, () => {
				resolve(false); // no veto, close window
			});

			ipc.once(cancelChannel, () => {
				resolve(true); // veto, not close window
			});

			window.send(IPC_EVENT.ON_BEFORE_UNLOAD, { okChannel, cancelChannel, reason });
		});
	}


	/**
	 *
	 * @param options
	 * 处理重启的process.env
	 */
	private handleRelaunchArgs(options?: { addArgs?: string[]; removeArgs?: string[]; }): string[] {
		const args = process.argv.slice(1);
		if (options && options.addArgs) {
			args.push(...options.addArgs);
		}
		if (options && options.removeArgs) {
			for (const a of options.removeArgs) {
				const idx = args.indexOf(a);
				if (idx >= 0) {
					args.splice(idx, 1);
				}
			}
		}
		return args;
	}

	/**
	 * 重启退出时的监听
	 */
	private relaunchQuitListener(quitVetoed: boolean, args: string[]) {
		if (!quitVetoed) {
			// Windows: we are about to restart and as such we need to restore the original
			// current working directory we had on startup to get the exact same startup
			// behaviour. As such, we briefly change back to the VSCODE_CWD and then when
			// Code starts it will set it back to the installation directory again.
			try {
				if (isWindows) {
					const vscodeCwd = process.env['VSCODE_CWD'];
					if (vscodeCwd) {
						process.chdir(vscodeCwd);
					}
				}
			} catch (err) {
				runError(err);
			}
			// relaunch after we are sure there is no veto
			app.relaunch({ args });
		}
	}

	relaunch(options?: { addArgs?: string[]; removeArgs?: string[]; }): void {
		const args = this.handleRelaunchArgs();
		let quitVetoed = false;
		app.once('quit', () => this.relaunchQuitListener(quitVetoed, args));
		this.quit().then(veto => quitVetoed == veto);
	}

	quit(fromUpdate?: boolean): Promise<boolean> {
		if (this.pendingQuitPromise) { return this.pendingQuitPromise; }

		this.pendingQuitPromise = new Promise(resolve => {
			//TODO: @pikun doesn't understand
			console.log('quit before promise');
			this.pendingQuitPromiseResolve = resolve;
			// Calling app.quit() will trigger the close handlers of each opened window
			// and only if no window vetoed the shutdown, we will get the will-quit event
			console.log('quit after promise');
			app.quit();
		});

		return this.pendingQuitPromise;

	}


	kill(code?: number): void {
		app.exit(code);
	}

	async when(phase: LifecycleMainPhase): Promise<void> {
		if (phase <= this._phase) {
			return;
		}

		let barrier = this.phaseWhen.get(phase);
		if (!barrier) {
			barrier = new Barrier();
			this.phaseWhen.set(phase, barrier);
		}

		await barrier.wait();
	}
}
