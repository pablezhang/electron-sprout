
/*
 * @Author: pikun
 * @Date: 2019-12-08 11:05:37
 * @LastEditTime: 2019-12-08 11:26:33
 * @Description:
 */
import { Event } from 'sprout/base/common/event';
import { createDecorator } from 'sprout/instantiation/instantiation';
import { ParsedArgs } from 'sprout/services/environment/common/environment';
export const IWindowsService = createDecorator<IWindowsService>('windowsService');
export interface INativeOpenDialogOptions {
	windowId?: number;
	forceNewWindow?: boolean;

	defaultPath?: string;
}

export interface FileFilter {
	extensions: string[];
	name: string;
}

export interface OpenDialogOptions {
	title?: string;
	defaultPath?: string;
	buttonLabel?: string;
	filters?: FileFilter[];
	properties?: Array<'openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles' | 'createDirectory' | 'promptToCreate' | 'noResolveAliases' | 'treatPackageAsDirectory'>;
	message?: string;
}

export interface MessageBoxOptions {
	type?: string;
	buttons?: string[];
	defaultId?: number;
	title?: string;
	message: string;
	detail?: string;
	checkboxLabel?: string;
	checkboxChecked?: boolean;
	cancelId?: number;
	noLink?: boolean;
	normalizeAccessKeys?: boolean;
}

export interface SaveDialogOptions {
	title?: string;
	defaultPath?: string;
	buttonLabel?: string;
	filters?: FileFilter[];
	message?: string;
	nameFieldLabel?: string;
	showsTagField?: boolean;
}

export interface INewWindowOptions {
	remoteAuthority?: string;
	reuseWindow?: boolean;
}

export interface IDevToolsOptions {
	mode: 'right' | 'bottom' | 'undocked' | 'detach';
}

export interface IWindowsService {

	_serviceBrand: undefined;

	readonly onWindowOpen: Event<number>;
	readonly onWindowBlur: Event<number>;
	readonly onWindowMaximize: Event<number>;
	readonly onWindowUnmaximize: Event<number>;

	reloadWindow(windowId: number, args?: ParsedArgs): Promise<void>;
}

export interface IMessageBoxResult {
	button: number;
	checkboxChecked?: boolean;
}

export interface IWindowService {
	_serviceBrand: undefined;

	readonly onDidChangeFocus: Event<boolean>;
	readonly onDidChangeMaximize: Event<boolean>;

	readonly hasFocus: boolean;

	readonly windowId: number;
	openWindow(): Promise<void>;
}

export type MenuBarVisibility = 'default' | 'visible' | 'toggle' | 'hidden';

export interface IWindowsConfiguration {
	window: IWindowSettings;
}

export interface IWindowSettings {
	openWithoutArgumentsInNewWindow: 'on' | 'off';
	restoreWindows: 'all' | 'folders' | 'one' | 'none';
	restoreFullscreen: boolean;
	zoomLevel: number;
	titleBarStyle: 'native' | 'custom';
	autoDetectHighContrast: boolean;
	menuBarVisibility: MenuBarVisibility;
	newWindowDimensions: 'default' | 'inherit' | 'maximized' | 'fullscreen';
	nativeTabs: boolean;
	nativeFullScreen: boolean;
	enableMenuBarMnemonics: boolean;
	closeWhenEmpty: boolean;
	clickThroughInactive: boolean;
}

export function getTitleBarStyle(): 'native' | 'custom' {
	// TODO: @pikun
	return 'custom';
}

export const enum OpenContext {

	// opening when running from the command line
	CLI,

	// macOS only: opening from the dock (also when opening files to a running instance from desktop)
	DOCK,

	// opening from the main application window
	MENU,

	// opening from a file or folder dialog
	DIALOG,

	// opening from the OS's UI
	DESKTOP,

	// opening through the API
	API
}

export const enum ReadyState {

	/**
	 * This window has not loaded any HTML yet
	 */
	NONE,

	/**
	 * This window is loading HTML
	 */
	LOADING,

	/**
	 * This window is navigating to another HTML
	 */
	NAVIGATING,

	/**
	 * This window is done loading HTML
	 */
	READY
}


export interface IWindowConfiguration extends ParsedArgs {
	windowId: number;
	mainPid: number;

	appRoot: string;
	execPath: string;
	isInitialStartup?: boolean;

	nodeCachedDataDir?: string;

	zoomLevel?: number;
	fullscreen?: boolean;
	maximized?: boolean;
	highContrast?: boolean;
	frameless?: boolean;
	accessibilitySupport?: boolean;
}
