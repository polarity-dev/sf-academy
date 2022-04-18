import { join } from "path"
import HtmlWebpackPlugin from "html-webpack-plugin"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import { Configuration } from "webpack"
import { Configuration as DevConfiguration } from "webpack-dev-server"
import { merge } from "webpack-merge"
import { host, externalPort } from "./config"

const baseConfig: Configuration = {
   mode: (process.env.NODE_ENV === "production") ? "production" : "development",
   context: __dirname,
   entry: './src/index.tsx',
   output: {
      path: join(__dirname, "build")
   },
   module: {
      rules: [
         {
            test: /\.(ts|tsx)$/,
            exclude: /node_modules/,
            resolve: {
               extensions: ['.ts', '.tsx', '.js', '.json', 'jsx'],
            },
            use: 'ts-loader',
         },
         {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader'],
         },
      ]
   },
   devtool: process.env.NODE_ENV ? undefined : 'source-map',
   plugins: [
      new HtmlWebpackPlugin({
         template: join(__dirname, 'public/index.html')
      }),
      new MiniCssExtractPlugin(),
   ]
}

const devConfig: Configuration = {
   devServer: {
      host: host,
      port: externalPort,
      static: {
         directory: join(__dirname, 'build'),
      }
   }
}

const prodConfig: Configuration = {
   mode: "production"
}
const config = merge(
   baseConfig,
   (process.env.NODE_ENV === "production") ? prodConfig :  devConfig as Configuration)
   
export default config