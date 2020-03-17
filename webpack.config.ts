import * as os from "os";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import TerserPlugin from "terser-webpack-plugin";
import OptimizeCssAssetsPlugin from "optimize-css-assets-webpack-plugin";

const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");

interface Options {
  buildTarget: webpack.Configuration["target"];
  output: webpack.Output;
  tsConfig: webpack.RuleSetQuery;
  isCli: boolean;
}

export const generateConfig = (
  isProduction: boolean,
  entry: webpack.Entry,
  options: Options,
): webpack.Configuration => {
  const pkgVersion = "1.0.0"

  const tsLoader: webpack.RuleSetUse = {
    loader: "ts-loader",
    options: options.tsConfig,
  };

  const babelLoader: webpack.RuleSetUse = {
    loader: "babel-loader",
    options: {
      cacheDirectory: true,
      presets: ["@babel/preset-env"],
    },
  };

  const cssLoaders: webpack.RuleSetUse = [
    {
      loader: "css-loader",
      options: {
        importLoaders: 2,
        localsConvention: "camelCase",
        modules: {
          mode: "local",
          localIdentName: "___[local]___[hash:base64:5]",
        },
      },
    },
    {
      loader: "postcss-loader",
      options: {
        plugins: [
          require("autoprefixer")({
            grid: true,
          }),
        ],
      },
    },
    {
      loader: "sass-loader",
      options: {
        implementation: require("sass"),
        sassOptions: {
          fiber: require("fibers"),
        },
      },
    },
  ];
  const config: webpack.Configuration = {
    mode: isProduction ? "production" : "development",
    target: options.buildTarget,
    optimization: {
      minimize: isProduction,
      runtimeChunk: false,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            // https://github.com/terser/terser#compress-options
            compress: {
              drop_console: true, // console.logなどを消す
            },
          },
          extractComments: {
            condition: true,
            banner: (licenseFile: string) =>
              os.EOL +
              [" * version@" + pkgVersion, ` * License information can be found in ${licenseFile}`].join(os.EOL) +
              os.EOL,
          },
        }),
        new OptimizeCssAssetsPlugin(),
      ],
    },
    entry,
    devtool: "cheap-source-map",
    externals: {},
    plugins: [
      new FriendlyErrorsWebpackPlugin(),
      new ForkTsCheckerWebpackPlugin(),
      new CleanWebpackPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        template: "public/index.html",
      }),
      isProduction &&
        new MiniCssExtractPlugin({
          filename: "[name].[contenthash:8].css",
          chunkFilename: "[name].[contenthash:8].chunk.css",
        }),
      new webpack.DefinePlugin({
        "process.env.VERSION": JSON.stringify(pkgVersion),
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "production"),
      }),
    ].filter(Boolean),
    output: options.output,
    resolve: {
      extensions: [".js", ".ts", ".tsx", ".scss", ".json"],
      alias: {},
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: [/__tests__/, /node_modules/],
          loaders: [babelLoader, tsLoader],
        },
        {
          test: /\.scss$/,
          loaders: [
            (options.isCli || isProduction) && MiniCssExtractPlugin.loader,
            !isProduction && "style-loader",
            ...cssLoaders,
          ].filter(Boolean) as webpack.RuleSetUse,
        },
      ],
    },
  };
  return config;
};
