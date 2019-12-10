<!--
 * @Author: pikun
 * @Date: 2019-12-04 19:48:32
 * @LastEditTime: 2019-12-08 09:40:35
 * @Description:
 -->
## ELECTRON-SPROUT
`ELECTRON-SPROUT` 是我在博客中从0到1搭建的`Electron`框架，最终会搭建成一个完善的`Electron`企业级框架供大家使用。初衷是让大家能够上手即用，不用去关心基础的业务轮子。比如文件处理服务、消息通知服务、日志服务、默认弹窗很丑等问题。

包含如下部分：
- `Electron + React + Mobx + Typescript + Webpack` 基础框架
- `Electron` ioc设计模式
- `Electron` 三方环境集成方案，如：flash、python环境
- `Electron` 打包（win32\win64\mac）、发布（包含如何签名、如何设置证书、windows\mac）
- `Electron` 模块化升级方案，做到像网页发布一样自由
- `Electron` 基础业务功能扩展性封装：主题，弹窗（文件弹窗、提示弹窗等）
- `Electron` windows | mac 分支分离管理， 可切不同版本electron，做适合的兼容性
- 服务的设计（main\render\通信）
- 常见企业化问题解决：如何解决360拦截问题、日志问题等

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

未完待续....
