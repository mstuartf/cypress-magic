const path = require("path");
const dotenv = require("dotenv");
const { DefinePlugin } = require("webpack");

const { SOCKET_URL } = dotenv.config().parsed;

module.exports = ({ entry, dir }) => {
  return {
    entry:
      entry === "main"
        ? "src/main.js"
        : {
            background: `/src/extension/background.ts`,
            content: `/src/extension/content.ts`,
            inject: `./src/extension/inject.ts`,
            login: `/src/extension/login.ts`,
            record: `/src/extension/record.ts`,
          },
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
      filename: "[name].js",
      path: path.resolve(__dirname, dir),
    },
    plugins: [
      new DefinePlugin({
        "process.env.SOCKET_URL": JSON.stringify(SOCKET_URL),
      }),
    ],
  };
};
