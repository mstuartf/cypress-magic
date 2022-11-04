const path = require("path");
const dotenv = require("dotenv");
const { DefinePlugin } = require("webpack");

const { SOCKET_URL } = dotenv.config().parsed;

module.exports = ({ filename, dir }) => {
  return {
    entry: `./src/${filename}.ts`,
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
      filename: `${filename}.js`,
      path: path.resolve(__dirname, dir),
    },
    plugins: [
      new DefinePlugin({
        "process.env.SOCKET_URL": JSON.stringify(SOCKET_URL),
      }),
    ],
  };
};
