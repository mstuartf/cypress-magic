module.exports = {
  webpack: {
    configure: (webpackConfig) => {
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
