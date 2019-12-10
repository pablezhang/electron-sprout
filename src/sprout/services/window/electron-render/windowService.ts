import { Disposable } from 'sprout/base/common/lifecycle';
import { IWindowService, IWindowsService } from 'sprout/services/windows/common/windows';
import { Event } from 'sprout/base/common/event';

export class WindowService extends Disposable implements IWindowService {

	readonly onDidChangeFocus: Event<boolean>;
	readonly onDidChangeMaximize: Event<boolean>;

	private _windowId: number;

	_serviceBrand: undefined;

	private _hasFocus: boolean;
	get hasFocus(): boolean { return this._hasFocus; }

	constructor(
		@IWindowsService private readonly windowsService: IWindowsService
	) {
		super();
		// TODO: @pikun with a way to get WindowId
		this._windowId = 1;

		this._hasFocus = document.hasFocus();
	}

	get windowId(): number {
		return this._windowId;
	}

	openWindow(): Promise<void> {
		return Promise.resolve();
	}


}
