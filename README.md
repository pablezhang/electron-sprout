<!--
 * @Author: pikun
 * @Date: 2019-12-04 19:48:32
 * @LastEditTime: 2019-12-08 09:40:35
 * @Description:
 -->
## ELECTRON-SPROUT
`ELECTRON-SPROUT` 是我在博客中从0到1搭建的`Electron`框架，最终会搭建成一个完善的`Electron`企业级框架供大家使用。包含如下部分：
- `Electron + React + Mobx + Typescript + Webpack` 基础框架
- `Electron` 多窗口设计
- `Electron` web和node依赖分离
- `Electron` 集成flash、ffmpeg
- `Electron` 打包（win32\win64\mac）、发布（包含如何签名、如何设置证书、windows\mac）
- `Electron` 企业级升级方案
- `Electron` 国际化
- `Electron` 主题
- `Electron` windows | mac 分支分离， 可切不同版本electron
- `Electron` ts
- 服务的设计（main\render\通信）
- 如何解决360拦截问题

博客地址：https://spcbacktolife.github.io
git: git@github.com:spcBackToLife/electron-sprout.git


# 本项目建议使用`vscode`编辑器

## 目录结构
	-- .vscode // vscode编辑器配置文件，用于帮助隐藏一些不需要看的文件，比如编译后的ts等。
  -- native-modules // 独立的npm包空间，存放需要`node-gyp`编译的依赖。
	-- configs // webpack打包配置文件、应用构建配置文件
	-- src // 主目录
	-- scripts // 放置一些脚本文件
	-- typings
	-- sprout // 核心代码
	-- resources // 静态资源
	-- test-grammer // 快速测试语法和api的文件夹

## sprout 核心目录结构
-- sprout
  -- windows // 管理多窗口的
	  -- mainWindow
			-- electron-main // 主进程使用
			-- electron-renderer // 渲染进程使用
			-- electron-bridge // 渲染进程与主进程通信处
			-- common // 主进程渲染进程公用
			-- index.html
		-- otherWindow
			-- electron-main // 主进程使用
			-- electron-renderer // 渲染进程使用

			-- electron-main // 主进程使用
			-- electron-renderer // 渲染进程使用
			-- electron-bridge // 渲染进程与主进程通信处
			-- common // 主进程渲染进程
	-- main.ts // 主入口

本框架运行环境分为：`electron-main`, `electron-render`

upath.normalizeSafe: 处理windows上路径问题，因此对于所有路径，均用此处理较好。

Property 'toUrl' does not exist on type 'NodeRequire'  => yarn add @types/webpack-env -D


'const' enums can only be used in property or index access expressions or the right hand side of an import declaration or export assignment or type query.


=> "preserveConstEnums": true,

Argument of type 'LifecycleMainPhase.Ready' is not assignable to parameter of type 'LifecyclePhase'.
