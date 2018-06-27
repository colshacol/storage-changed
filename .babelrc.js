module.exports = {
  presets: [
    "babel-preset-minify",
    [
      "@babel/preset-env",
      {
        modules: 'commonjs'
      }
    ]
  ]
}