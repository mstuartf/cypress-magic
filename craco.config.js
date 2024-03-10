const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const miniCssExtractPlugin = webpackConfig.plugins.find(
        (webpackPlugin) => webpackPlugin instanceof MiniCssExtractPlugin
      );
      if (miniCssExtractPlugin) {
        miniCssExtractPlugin.options.filename = "css/[name].css";
      }
      return {
        ...webpackConfig,
        entry: {
          main: "./src/index.tsx",
          background: "./src/chrome/background.ts",
          content: "./src/widget.tsx",
        },
        output: {
          ...webpackConfig.output,
          filename: "static/js/[name].js",
        },
        optimization: {
          ...webpackConfig.optimization,
          runtimeChunk: false,
          minimize: false,
        },
      };
    },
  },
};
