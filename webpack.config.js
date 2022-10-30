const path = require("path");
const dotenv = require("dotenv");
const { DefinePlugin } = require("webpack");

const env = dotenv.config().parsed;

module.exports = {
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  plugins: [
    new DefinePlugin({
      "process.env.SOCKET_URL": JSON.stringify(env.SOCKET_URL),
    }),
  ],
};
