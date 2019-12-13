// 初始化主窗口中需要的服务

import {WindowsService} from 'sprout/services/windows/electron-render/windowsService';
import { registerSingleton } from 'sprout/instantiation/extensions';
import { IWindowsService } from 'sprout/services/windows/common/windows';

import { ILifecycleService } from 'sprout/services/lifecycle/common/lifecycle';
import { LifecycleService } from 'sprout/services/lifecycle/electron-render/lifecycleService';

registerSingleton(IWindowsService, WindowsService);
registerSingleton(ILifecycleService, LifecycleService);
