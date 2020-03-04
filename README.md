## 启动
```bash
    yarn global add cross-env
    cross-env ELECTRON_MIRROR=https://npm.taobao.org/mirrors/electron/ yarn add electron@6.0.9  -D
    yarn install

```

本地开发执行：

```bash
    yarn dev
```
打包：
```javascript
    // 打包mac
    yarn pack-production-mac
    // win： win64  请看： https://juejin.im/post/5e1ee9f5f265da3e177f13f7
    yarn pack-production-win32
```