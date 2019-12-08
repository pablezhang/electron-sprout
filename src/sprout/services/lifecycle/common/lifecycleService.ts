/*
 * @Author: pikun
 * @Date: 2019-12-08 10:44:55
 * @LastEditTime: 2019-12-08 10:49:05
 * @Description:
 */
import { Event, Emitter } from 'sprout/base/common/event';
import { Barrier } from 'sprout/base/common/async';
import { ILifecycleService, BeforeShutdownEvent, WillShutdownEvent, StartupKind, LifecyclePhase, LifecyclePhaseToString } from 'sprout/services/lifecycle/common/lifecycle';
import { Disposable } from 'sprout/base/common/lifecycle';
export abstract class AbstractLifecycleService extends Disposable implements ILifecycleService {
	_serviceBrand: undefined;

	protected readonly _onBeforeShutdown = this._register(new Emitter<BeforeShutdownEvent>());
	readonly onBeforeShutdown: Event<BeforeShutdownEvent> = this._onBeforeShutdown.event;

	protected readonly _onWillShutdown = this._register(new Emitter<WillShutdownEvent>());
	readonly onWillShutdown: Event<WillShutdownEvent> = this._onWillShutdown.event;

	protected readonly _onShutdown = this._register(new Emitter<void>());
	readonly onShutdown: Event<void> = this._onShutdown.event;

	protected _startupKind: StartupKind;
	get startupKind(): StartupKind { return this._startupKind; }

	private _phase: LifecyclePhase = LifecyclePhase.Starting;
	get phase(): LifecyclePhase { return this._phase; }

	private phaseWhen = new Map<LifecyclePhase, Barrier>();

	constructor() {
		super();
	}

	set phase(value: LifecyclePhase) {
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

	async when(phase: LifecyclePhase): Promise<void> {
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
