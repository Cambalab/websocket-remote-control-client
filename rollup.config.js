import resolve from '@rollup/plugin-node-resolve'
import babel from 'rollup-plugin-babel'

export default {
  input: 'webcontrol.client.js',
  output: {
    file: 'index.js',
    format: 'umd',
    name: 'webcontrol'
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    })
  ]
}
