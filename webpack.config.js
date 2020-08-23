const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');


const isProd = process.env.NODE_ENV === 'production'
const isDev = !isProd;

const fileName = ext=> isDev ? `bundle.${ext}`:`bundle[hash].${ext}`;
const jsLoader = ()=>{
    const loaders = [
     {
        loader: "babel-loader",
            options: {
            presets:["@babel/preset-env"]
        }
    }
    ]
    if(isDev){
        loaders.push('eslint-loader')
    }
    return loaders;

}

console.log('is prod', isProd);
console.log('is dev',isDev);
module.exports = {
    context: path.resolve(__dirname,'src'),
    mode:'development',
    entry:['@babel/polyfill','./index.js'],
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:fileName('js')
    },
    resolve:{
        extensions: ['.js'],
        alias: {
            '@':path.resolve(__dirname,'source'),
            '@core':path.resolve(__dirname,'src/core')
        }
    },
    devtool: isDev ? 'source-map':false,
    devServer:{
        port:3000,
        hot:isDev
    },
    plugins:[
    new CleanWebpackPlugin(),
        new HTMLWebpackPlugin({
            template:'index.html',
            minify:{
                removeComments:isProd,
                collapseWhitespace:isProd
            }
        }),
        new CopyPlugin({
            patterns: [
                { from: path.resolve(__dirname,'src/favicon.ico'),
                    to: path.resolve(__dirname,'dist')
                },
            ],
        }),
        new MiniCSSExtractPlugin({
            filename:fileName('css')
        })
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    {
                        loader:MiniCSSExtractPlugin.loader,
                        options: {
                            hmr:isDev,
                            reloadAll:true
                        },
                    },
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use:jsLoader()
            }
        ],

    }
};