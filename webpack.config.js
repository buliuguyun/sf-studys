const path = require('path');
const html = require('html-webpack-plugin'); // 打包HTML文件
const uglify = require('uglifyjs-webpack-plugin') // js文件压缩
const miniCss = require("mini-css-extract-plugin"); // css文件分离
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); // 打包前清除dist文件
if(process.env.type== "build"){
  // 开发环境url
  var website={
    publicPath:"http://192.168.1.7:1024/"
  }
}else{
  // 生产环境url
  var website={
    publicPath:"https://www.baidu.com/"
  }
}
module.exports = {
  // source-map:在一个单独文件中产生一个完整且功能完全的文件。这个文件具有最好的source map,但是它会减慢打包速度；
  // cheap-module-source-map:在一个单独的文件中产生一个不带列映射的map，不带列映射提高了打包速度，但是也使得浏览器开发者工具只能对应到具体的行，不能对应到具体的列（符号）,会对调试造成不便。
  // eval-source-map:使用eval打包源文件模块，在同一个文件中生产干净的完整版的sourcemap，但是对打包后输出的JS文件的执行具有性能和安全的隐患。在开发阶段这是一个非常好的选项，在生产阶段则一定要不开启这个选项。
  // cheap-module-eval-source-map:这是在打包文件时最快的生产source map的方法，生产的 Source map 会和打包后的JavaScript文件同行显示，没有影射列，和eval-source-map选项具有相似的缺点。
  devtool: 'eval-source-map',
  // 入口文件配置项
  entry:{
    // 多入口
    entry:'./src/entry.js',
    // aa: './src/entry1.js'
  },
  // 出口文件配置项
  output: {
    path: path.resolve(__dirname,'dist'), // 打包文件的路径
    filename: '[name].js', // [name].js  生成的打包文件，同src目录下一致
    publicPath: website.publicPath // 打包之后的资源路径
  },
  //插件，用于生产模版和各项功能
  plugins: [
    new CleanWebpackPlugin(), // 打包前清除dist文件
    // 打包HTML文件
    new html({
      minify: false, // 是否压缩
      hash: false, // 如果true  webpack 为所有包含的脚本和CSS文件 添加唯一的 编译哈希。 这对缓存清除非常有用
      template: path.resolve(__dirname,'./src/index.html'),  // webpack 需要模板的路径
      filename: 'index.html' // 要将HTML写入的文件。 默认为 index.html 
    }),
    new uglify(), // js文件压缩
    new miniCss({ // css文件分离
      filename: 'css/[name].css'
    })
  ],
  //模块：例如解读CSS,图片如何转换，压缩
  module: {
    rules: [
      // css,less文件如何处理
      {
        test: /\.(less|css)$/,
        use: [
          miniCss.loader, // 分离css文件
          'css-loader',
          'postcss-loader', // css增加前缀
          'less-loader',  // 解析less
        ]
      },
      // 图片如何处理
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 50, // 是把小于50B的文件打成Base64的格式，写入JS
              outputPath: 'images/',
              esModule:false
            }
          }
        ]
      },
      // html中图片处理
      {
        test: /\.(htm|html)$/i,
        use:[ 'html-withimg-loader']
      },
      // 转换为es6语法
      {
        test:/\.(jsx|js)$/,
        use:{
          loader:'babel-loader'
        },
        exclude:/node_modules/
      }
    ]
  },
  //配置webpack开发服务功能，热更新
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'), // 设置基本目录结构
    host: '192.168.1.7', // 服务器的IP地址
    compress: true, // 服务端压缩是否开启
    port: 1024 // 端口
  }
}
