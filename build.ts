import webpack from "webpack";
import { generateConfig } from "./webpack.config";
import * as path from "path";

const main = async () => {
  const clientConfig = generateConfig(
    true,
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
        filename: "[name].[hash:8].js",
        path: path.join(__dirname, "dist"),
        pathinfo: false,
      },
      isCli: false,
    },
  );
  const compiler = webpack(clientConfig);
  compiler.run(err => {
    if (err) {
      console.error(err);
    }
  });
};

main().catch(console.error);
