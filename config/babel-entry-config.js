module.exports = {
  extensions: ['.js', '.ts', '.tsx'],
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { electron: require('electron/package.json').version },
        useBuiltIns: 'usage',
        modules: 'commonjs',
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
  ],
};
