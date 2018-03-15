'use strict';

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const webpackNotifierPlugin = require('webpack-notifier');
const htmlWebpackPlugin = require('html-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');
const notifier = require('node-notifier');
const { exec, execSync, spawn } = require('child_process');
const root = function (relativePath = '.') {
  return path.join(__dirname, relativePath);
}

const TITLE = 'Parrot Wings';
const DEV_SERVER_HOST = 'localhost';
const DEV_SERVER_PORT = 9000;
const API_URL = 'http://localhost:59442/';

module.exports = env => {
  console.log('env', env);

  return {
    context: root('src'),
    entry: ['default-theme', '@material/typography', './Startup'],
    output: {
      path: root('dist'),
      filename: '[name].bundle.js'
    },
    
    resolve: {
      modules: ['./', 'node_modules'],
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        'default-theme': root('Content/Styles/bundle.scss'),
        '@material/typography': root('node_modules/@material/typography/mdc-typography.scss'),
        '@Core': 'Core',
        '@Actions': 'Actions',
        '@Models': 'Models',
        '@Views': 'Views'
      },
    },

    plugins: [
      new webpackNotifierPlugin({ title: TITLE }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.ProvidePlugin({
        '$': 'jquery',
        'jQuery': 'jquery',
        'window.jQuery': 'jquery',
        'react': 'react',
        'React': 'react',
        'ReactDOM': 'react-dom',
        'Popper': 'popper.js'
      }),
      new webpack.DefinePlugin({
        API_URL: JSON.stringify(API_URL),
        TITLE: JSON.stringify(TITLE),
      }),
      new htmlWebpackPlugin({
        title: TITLE,
        inject: true,
        template: root('index.html'),
      }),
      new copyWebpackPlugin([
        { from: root('Content/Images'), to: root('dist/images') }
      ],
      { debug: 'debug', }
      ),
    ],

    module: {
      rules: [
        {
          test: /\.ts(x|)?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            query: {
              presets: ['es2015', 'react', 'stage-1'],
              plugins: ['transform-es2015-modules-amd']
            }
          }
        },
        {
          test: /\.(s|)css$/,
          use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' },
            { loader: 'sass-loader' }
          ]
        },
        {
          test: /\.(woff|woff2|ttf|eot)(.*)$/,
          use: {
            loader: 'url-loader',
            query: {
              limit: 10000,
              name: 'fonts/[name].[ext]'
            }
          }
        },
        {
          test: /(glyphicons-halflings-regular|fontawesome-webfont)\.svg(.*)$/,
          use: {
            loader: 'url-loader',
            query: {
              limit: 10000,
              mimetype: 'image/svg+xml',
              name: 'fonts/[name].[ext]'
            }
          }
        },
      ]
    },

    devtool: 'inline-source-map',
    
    // dev server config
    devServer: {
      contentBase: root(),
      historyApiFallback: true,
      hot: true,
      host: DEV_SERVER_HOST,
      port: DEV_SERVER_PORT,
      index: 'index.html',
      inline: true,
      open: true,
      after: function () {
        const nugetPath = `${root('../.nuget/nuget.exe')}`;
        const msbuildPath = `${env.system}/Microsoft.NET/Framework/v4.0.30319/MSBuild.exe`;
        const iisExpressPath = `${env.programFiles86}/IIS Express/iisexpress.exe`;
        const applicationhostPath = path.resolve('../.vs/config/applicationhost.config');

        if (!fs.existsSync(nugetPath))
        {
          if (!fs.existsSync(root('../.nuget'))) 
          {
            fs.mkdirSync(root('../.nuget'));
          }
          
          execSync(`powershell -Command "(New-Object Net.WebClient).DownloadFile('https://dist.nuget.org/win-x86-commandline/latest/nuget.exe', '${nugetPath}')"`);
        }
        
        if (!fs.existsSync(msbuildPath))
        {
          console.log('MSBuild not found. Please run the ParrotWings.Api manually.');
          console.log(msbuildPath);

          notifier.notify({
            type: 'warn',
            title: TITLE,
            message: 'MSBuild not found. Please run the ParrotWings.Api manually.'
          });
        }
        else
        {
          if (!fs.existsSync(iisExpressPath)) {
            console.log('IIS Express not found. Please run the ParrotWings.Api manually.');
            console.log(iisExpressPath);

            notifier.notify({
              type: 'warn',
              title: TITLE,
              message: 'IIS Express not found. Please run the ParrotWings.Api manually.'
            });
          } else {
            if (!fs.existsSync(applicationhostPath)) {
              notifier.notify({
                type: 'warn',
                title: TITLE,
                message: 'Cannot find file "applicationhost.config". Please run the ParrotWings.Api manually.'
              });
            } else {
              execSync(`"${nugetPath}" restore "${root('../ParrotWings.sln')}"`);
              execSync(`"${msbuildPath}" "${root('../ParrotWings.Api/ParrotWings.Api.csproj')}" /p:VisualStudioVersion=14.0`);
              exec(`"${iisExpressPath}" /config:"${applicationhostPath}"  /site:"ParrotWings.Api" /apppool:"Clr4IntegratedAppPool`, { detached: true });
            }
          }
        }
      }
    },
  }
};