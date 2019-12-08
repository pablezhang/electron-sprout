/*
 * @Author: pikun
 * @Date: 2019-12-08 10:50:34
 * @LastEditTime: 2019-12-08 10:59:49
 * @Description:
 */
import {AbstractLifecycleService} from 'sprout/services/lifecycle/common/lifecycleService';
import { ShutdownReason, StartupKind, handleVetos } from 'sprout/services/lifecycle/common/lifecycle';
import { ipcRenderer as ipc } from 'electron';
import { IPC_EVENT } from 'sprout/constants/ipcEvent';
export class LifecycleService extends AbstractLifecycleService {
	_serviceBrand: undefined;
	private static readonly LAST_SHUTDOWN_REASON_KEY = 'lifecyle.lastShutdownReason';
	private shutdownReason: ShutdownReason;
	constructor() {
		super();
		this._startupKind = this.resolveStartupKind();

		this.registerListeners();
	}

	private registerListeners(): void {
		// TODO: @pikun use windowservice to get windowId
		const windowId = '1';
		ipc.on(IPC_EVENT.ON_BEFORE_UNLOAD, (_event: unknown, reply: { okChannel: string, cancelChannel: string, reason: ShutdownReason }) => {
			this.handleBeforeShutdown(reply.reason).then(veto => {
				if (veto) {
					ipc.send(reply.cancelChannel, windowId);
				} else {
					this.shutdownReason = reply.reason;
					ipc.send(reply.okChannel, windowId);
				}
			});
		})
	}

	private resolveStartupKind(): StartupKind {
		// TODO: @pikun
		return StartupKind.NewWindow;
	}

	private handleBeforeShutdown(reason: ShutdownReason): Promise<boolean> {
		const vetos: (boolean | Promise<boolean>)[] = [];

		this._onBeforeShutdown.fire({
			veto(value) {
				vetos.push(value);
			},
			reason
		});

		return handleVetos(vetos, err => {
			//TODO: @pikun
			console.error('err:', err);
		});
	}

	private async handleWillShutdown(reason: ShutdownReason): Promise<void> {
		const joiners: Promise<void>[] = [];

		this._onWillShutdown.fire({
			join(promise) {
				if (promise) {
					joiners.push(promise);
				}
			},
			reason
		});

		try {
			await Promise.all(joiners);
		} catch (error) {
			//TODO: @pikun
			console.error('err:', error);
		}
	}
}
