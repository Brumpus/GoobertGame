import path from "node:path";
import { fileURLToPath } from "node:url";
import CopyPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// this can be set on the call to webpack to branch logic based upon environment
let production = process.env.NODE_ENV === "production";

const config = {
    mode: "development",
    entry: "./src/App.tsx",
    output: {
        filename: "tamagotchi-bundle.js",
        path: path.resolve(__dirname, "dist"),
        clean: true
    },
    devServer: {
        static: "./dist",
        historyApiFallback: {
            index: "/index.html"
        }
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    module: {
        rules: [
            {
                test: /\.tsx$|\.ts$/,
                exclude: /node_modules/,
                use: "ts-loader"
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: ["style-loader", "css-loader"] // loader pipeline (actually stack)
                                                    // processes from right-to-left
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {from: "./src/images", to: "images"},
                {from: "./src/audio", to: "audio"},
                // {from: "./src/css", to: "css"},  // no longer needed after css/style loaders added
                {from: "./src/bootstrap", to: "bootstrap"},
                {from: "./src/icons-1.13.1/font", to: "icons-1.13.1/font"},
                { from: "./src/react", to: "react" },
            ]
        }),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "index.html",
            
        })
    ]
}

// make changes to config based upon production build/deploy
if (production) {
    config.mode = "production";
    config.plugins = [
        new CopyPlugin({
            patterns: [
                {from: "./src/images", to: "images"},
                // {from: "./src/css", to: "css"},  // no longer needed after css/style loaders added
            ]
        }),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "index.html"
        })
    ];
}

export default config;