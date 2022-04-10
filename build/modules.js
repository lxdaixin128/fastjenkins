const { build } = require('esbuild');
const { resolve } = require('path');
const { lessLoader } = require('esbuild-plugin-less');
// plugin
function buildPlugin(isWatch = true) {
  const buildOpts = {
    entryPoints: ['plugin/extension.ts'],
    outfile: 'dist/extension.js',
    bundle: true,
    minify: true,
    platform: 'node',
    sourcemap: true,
    external: ['vscode'],
    format: 'cjs',
    target: ['esnext'],
  };

  if (isWatch) {
    buildOpts.watch = {
      onRebuild(error, result) {
        if (error) console.error('watch build failed:', error);
        else console.log('[plugin build succeeded]:', result);
      },
    };
  }

  return build(buildOpts).catch(console.log);
}

// webview
function buildWebView(isWatch = true) {
  const buildOpts = {
    entryPoints: ['src/main.tsx'],
    outfile: 'dist/main.js',
    bundle: true,
    minify: false,
    sourcemap: true,
    format: 'esm',
    target: ['esnext'],
    inject: [resolve(__dirname, './react-shim.js')],
    plugins: [lessLoader()],
  };

  if (isWatch) {
    buildOpts.watch = {
      onRebuild(error, result) {
        if (error) console.error('watch build failed:', error);
        else console.log('[webview build succeeded]:', result);
      },
    };
  }

  return build(buildOpts).catch(console.log);
}

module.exports = {
  buildPlugin,
  buildWebView,
};
