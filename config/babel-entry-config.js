module.exports = {
  extensions: ['.js', '.ts', '.jsx', '.tsx'],
	presets: [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage"
      }
    ],
    ["@babel/preset-react"],
    ["@babel/preset-typescript"]
  ],
  plugins: [
    "const-enum",
    ["@babel/plugin-transform-typescript",{"allowNamespaces": true}], // 解决namespace 报错 https://babeljs.io/docs/en/babel-plugin-transform-typescript#typescript-compiler-options
    "@babel/plugin-syntax-dynamic-import",
    ["@babel/plugin-transform-runtime"],
    ["@babel/plugin-proposal-decorators", {"legacy": true}], // 用于装饰器，先 proposal-decorators 再 proposal-class-properties
    ["@babel/plugin-proposal-class-properties", { "loose": true }] // 用于装饰器
  ]
};
