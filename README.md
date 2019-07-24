<div align="center">
  <h1>gatsby-plugin-scss-typescript</h1>
  🛠️
</div>

<br />

<p align="center">
    <!-- <a href="https://circleci.com/gh/Debens/gatsby-plugin-scss-typescript"><img src="https://circleci.com/gh/Debens/gatsby-plugin-scss-typescript.svg?style=shield&circle-token=2d506be7c3ec07e440056881ce5c376f7618f214)" alt="CircleCI"/></a> -->
    <a href="https://www.npmjs.com/package/gatsby-plugin-scss-typescript"><img src="https://img.shields.io/npm/v/gatsby-plugin-scss-typescript.svg" alt="NPM Version" /></a>
    <a href="https://www.npmjs.com/package/gatsby-plugin-scss-typescript"><img src="https://img.shields.io/npm/dw/gatsby-plugin-scss-typescript.svg" alt="npm" /></a>
    <img src="https://img.shields.io/bundlephobia/min/gatsby-plugin-scss-typescript.svg" alt="npm bundle size" />
    <img src="https://img.shields.io/npm/l/gatsby-plugin-scss-typescript.svg" alt="License" />
</p>

<hr />

Includes Gatsby V2 webpack support for SCSS stylesheets modules and automatic generation of accompanying typing declaration (`.d.ts`) files.

## Install

`yarn add --dev gatsby-plugin-scss-typescript node-sass`

or

`npm install --save-dev gatsby-plugin-scss-typescript node-sass`

**NOTE:** From v4.0.0, node-sass has been moved to a peer dependency.

## Usage

1.  Include the plugin in your `gatsby-config.js` file.

```javascript
// gatsby-config.js
plugins: ['gatsby-plugin-scss-typescript'];
```

2.  Write your SCSS, import & use them as normal.

```javascript
// component.ts
import * as styles from './styles.module.scss';
```

Only files that include the `.module.scss` extensions shall be treated as module files, and hence have typings generated at build time. `.scss` files shall be loaded using the regular [css-loader](https://github.com/webpack-contrib/css-loader).

## Options

The default gatsby rule loaders are used where possible, see the [gatsby webpack utils](https://github.com/gatsbyjs/gatsby/blob/0deda7b5646b3eb8db1b1873faf13553311c4878/packages/gatsby/src/utils/webpack-utils.js) for more info.

### cssLoaderOptions

The `cssLoaderOptions` key is passed to the [css-loader](https://github.com/webpack-contrib/css-loader), with a few [defaults](https://github.com/gatsbyjs/gatsby/blob/0deda7b5646b3eb8db1b1873faf13553311c4878/packages/gatsby/src/utils/webpack-utils.js#L392-L403) from gatsby.

### sassLoaderOptions

The `sassLoaderOptions` key is passed to the [sass-loader](https://github.com/webpack-contrib/sass-loader).

### cssMinifyOptions

The `cssMinifyOptions` key is passed to the [OptimizeCssAssetsPlugin](https://github.com/NMFR/optimize-css-assets-webpack-plugin).

### cssExtractOptions

The `cssExtractOptions` key is passed to the [MiniCssExtractPlugin](https://github.com/gatsbyjs/gatsby/blob/0deda7b5646b3eb8db1b1873faf13553311c4878/packages/gatsby/src/utils/webpack-utils.js#L482-L487).

### Example

```javascript
// in gatsby-config.js
plugins: [
    {
        resolve: 'gatsby-plugin-scss-typescript',
        options: {
            cssLoaderOptions: {
                importLoaders: 1,
                localIdentName: '[name]_[local]___[hash:base64:5]_[emoji:1]',
            },
            sassLoaderOptions: {
                includePaths: [path.resolve(__dirname, './src/styles/scss')],
            },
            cssMinifyOptions: {
                assetNameRegExp: /\.optimize\.css$/g,
                canPrint: true,
            },
            cssExtractOptions: {
                filename: '[name].css',
                chunkFilename: '[id].css',
            },
        },
    },
];
```
