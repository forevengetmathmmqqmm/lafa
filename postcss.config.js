// PostCSS 配置文件，用于处理 CSS 转换和优化
// 更多配置信息可参考：https://postcss.org/

export default {
  plugins: {
    // Tailwind CSS 插件，用于处理 Tailwind 语法
    // 参考：https://tailwindcss.com/
    tailwindcss: {},
    
    // Autoprefixer 插件，用于自动添加 CSS 浏览器前缀
    // 参考：https://github.com/postcss/autoprefixer
    autoprefixer: {},
    
    // PostCSS PX to REM 插件，用于将 CSS 中的 px 单位转换为 rem 单位
    // 参考：https://github.com/cuth/postcss-pxtorem
    'postcss-pxtorem': {
      // 根元素字体大小，通常与设计稿宽度相关
      // 此处设置为 75，适用于 750px 宽度的设计稿（常见的移动端设计稿宽度）
      // 转换公式：rem 值 = px 值 / rootValue
      // 例如：设计稿中 150px = 150/75 = 2rem
      // 配合 amfe-flexible，在 375px 屏幕上 1rem = 37.5px，2rem = 75px，正好是设计稿的一半
      // 如果设计稿宽度不同，需相应调整此值（例如：375px 设计稿对应 37.5）
      rootValue: 137,
      
      // 需要转换的属性列表，* 表示所有属性
      // 例如：['font-size', 'width', 'height'] 表示只转换这些属性
      propList: ['*'],
      
      // rem 单位的小数位数精度
      unitPrecision: 2,
      
      // 选择器黑名单，匹配到的选择器将不进行转换
      // 例如：['.no-rem'] 表示类名为 no-rem 的元素不转换
      selectorBlackList: [],
      
      // 是否替换原有的 px 值，而不是添加备用值
      replace: true,
      
      // 是否在媒体查询中转换 px
      mediaQuery: false,
      
      // 需要转换的最小 px 值
      // 小于此值的 px 将不进行转换
      minPixelValue: 0,
      
      // 排除文件路径正则表达式
      // /node_modules/i 表示排除 node_modules 目录下的文件
      exclude: /node_modules/i
    },
  },
}