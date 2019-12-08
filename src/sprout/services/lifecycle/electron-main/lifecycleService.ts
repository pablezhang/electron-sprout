/*
 * @Author: pikun
 * @Date: 2019-12-08 11:00:12
 * @LastEditTime: 2019-12-08 13:47:35
 * @Description:
 */
import { ipcMain as ipc, app } from 'electron';
import { Event, Emitter } from 'sprout/base/common/event';
import { createDecorator } from 'sprout/instantiation/instantiation';
import { ICodeWindow } from 'sprout/services/windows/electron-main/windows';
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
