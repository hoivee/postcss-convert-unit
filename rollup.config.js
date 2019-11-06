import babel from 'rollup-plugin-babel'
import { eslint } from 'rollup-plugin-eslint'

export default {
  input: 'src/index.js',
  output: [
    { file: 'index.js', format: 'cjs', sourcemap: true },
    { file: 'index.mjs', format: 'esm', sourcemap: true }
  ],
  plugins: [
    eslint(),
    babel({
      presets: [
        ['@babel/env', { targets: { node: 6 } }]
      ]
    })
  ]
}
