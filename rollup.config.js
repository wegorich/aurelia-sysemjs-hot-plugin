import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
// import uglify from 'rollup-plugin-uglify'

export default {
  entry: './lib/index.js',
  dest: './dist/index.js',
  moduleName: 'aurelia-systemjs-hot-plugin',
  format: 'cjs',
  // sourceMap: 'inline',
  external: ['aurelia-hot-module-reload', 'aurelia-loader-systemjs'],
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    commonjs({
      exclude: [ 'node_modules/aurelia-hot-module-reload/**', 'node_modules/aurelia-loader-systemjs/**']
    }),
    babel({
      exclude: 'node_modules/**'
    }),
    // (process.env.NODE_ENV === 'production' && uglify())
  ]
}