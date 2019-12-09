/*
 * @Author: pikun
 * @Date: 2019-12-08 11:00:12
 * @LastEditTime: 2019-12-08 22:24:35
 * @Description:
 */
import { ipcMain as ipc, app } from 'electron';
import { Event, Emitter } from 'sprout/base/common/event';
import { createDecorator } from 'sprout/instantiation/instantiation';
import { ICodeWindow } from 'sprout/services/windows/electron-main/windows';
import { Disposable } from 'sprout/base/common/lifecycle';
import { Barrier } from 'sprout/base/common/async';
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
	}

	private windowAllClosedListener() {
		app.quit();
	}

	private beforeQuitListener() {
		if (this._quitRequested) {
			return;
		}

		this._quitRequested = true;
		this._onBeforeShutdown.fire();
	}

	private willQuitListener(e: any) {
		e.preventDefault();
		app.removeListener('before-quit', this.beforeQuitListener);
		app.removeListener('window-all-closed', this.windowAllClosedListener);
		app.quit();
	}

	async unload(window: ICodeWindow, reason: UnloadReason): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	relaunch(options?: { addArgs?: string[]; removeArgs?: string[]; }): void {
		throw new Error('Method not implemented.');
	}
	quit(fromUpdate?: boolean): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	kill(code?: number): void {
		throw new Error('Method not implemented.');
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
