import vue from "rollup-plugin-vue"
import postcss from "rollup-plugin-postcss"
import css from "rollup-plugin-css-only"
import del from "rollup-plugin-delete"
export default {
  input: "./src/index.js",
  // 每次打包时候清楚之前的打包文件
  output: [
    {
      file: "./dist/my-lib-es.js",
      format: "es"
    }
  ],
  plugins: [del({ targets: "dist/*" }), vue({}), postcss()]
}
