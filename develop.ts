import webpack from "webpack";
import { generateConfig } from "./webpack.config";
import * as path from "path";

const webpackDevServer = require("webpack-dev-server");

const main = async () => {
  const config = generateConfig(
    false,
    {
      application: "./src/index.tsx",
    },
    {
      tsConfig: {
        configFile: "tsconfig.json",
        transpileOnly: true,
      },
      buildTarget: "web",
      output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "debug-dist"),
        pathinfo: true,
      },
      isCli: false,
    },
  );
  const compiler = webpack(config);
  const server = new webpackDevServer(compiler, {
    hot: true,
    open: true,
    historyApiFallback: true,
  });
  await server.listen(4000);
};

main().catch(console.error);
