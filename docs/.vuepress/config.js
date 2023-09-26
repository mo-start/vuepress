
// import { defineConfig } from "vuepress/config";
// export default defineConfig({
//   configureWebpack: {},
//   plugins: [
//     [
//       'vuepress-plugin-typescript',
//       {
//         tsLoaderOptions: {
//           // ts-loader 的所有配置项
//         },
//       },
//     ],
//   ]
//   // ...
// });
module.exports = {
  themeConfig: {
    sidebar: [
      '/',
      ['/guide/', 'guide demo link text']
    ]
  },
  configureWebpack: {
    module: {
      // rules: [{
      //   test: /\.scss$/,
      //   use: [
      //       "css-loader", 
      //       "sass-loader" 
      //   ]
      // }]
    },
    resolve: {
      alias: {
        // '@src': path.resolve(__dirname, '../../src/'),
      }
    }
  },
  plugins: [
    [
      'vuepress-plugin-typescript',
      {
        tsLoaderOptions: {
          // ts-loader 的所有配置项
        },
      },
    ],
  ]
}