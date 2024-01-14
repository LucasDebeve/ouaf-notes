const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    entry: {
        app: "./src/index.js",
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Production",
            template: path.resolve(__dirname, "./src/template.html"),
            filename: "index.html",
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css",
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "style-loader",
                    "css-loader",
                ],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
            },
        ],
    },
    optimization: {
        minimizer: [`...`, new TerserPlugin(), new CssMinimizerPlugin()],
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
};
