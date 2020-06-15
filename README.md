<div align="center">
  <h1>gatsby-plugin-scss-typescript</h1>
  🛠️
</div>

<br />

<p align="center">
    <a href="https://circleci.com/gh/Debens/gatsby-plugin-scss-typescript"><img src="https://circleci.com/gh/Debens/gatsby-plugin-scss-typescript.svg?style=shield&circle-token=2d506be7c3ec07e440056881ce5c376f7618f214)" alt="CircleCI"/></a>
    <a href="https://www.npmjs.com/package/gatsby-plugin-scss-typescript"><img src="https://img.shields.io/npm/v/gatsby-plugin-scss-typescript.svg" alt="NPM Version" /></a>
    <a href="https://www.npmjs.com/package/gatsby-plugin-scss-typescript"><img src="https://img.shields.io/npm/dw/gatsby-plugin-scss-typescript.svg" alt="npm" /></a>
    <img src="https://img.shields.io/bundlephobia/min/gatsby-plugin-scss-typescript.svg" alt="npm bundle size" />
    <img src="https://img.shields.io/npm/l/gatsby-plugin-scss-typescript.svg" alt="License" />
</p>

<hr />

Includes Gatsby V2 drop-in webpack support for SCSS stylesheets modules & automatic generation of accompanying typing declaration (`.d.ts`) files.

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

### FAQs

#### <u>The plugin has generated a bunch of `.d.ts` files?!</u>

Firstly, thats not really a question, but we can take a stab at it.

Yes, it does generate a bunch of files, one for each `.module.scss` file imported by a react component.

#### <u>What do the `.d.ts` file do?</u>

Thats better as a question. These are [Typescript declaration files](https://microsoft.github.io/TypeScript-New-Handbook/chapters/type-declarations/), they essentially describe a js module, such that TS can expect the details that are declared.

In this case they are describing what the scss will look like once it has been turned into a js module. 

This is what is happening under the surface, when you write:

```ts
import * as styles from './styles.module.scss';
```

You are importing a js module that can be transpiled from your scss using a [webpack loader](https://webpack.js.org/loaders/).

#### <u>Should I commit these files?</u>

Yes, I recommend that they are committed into your project. These files can be reviewed in PRs like any other file, and are only generated when running `gatsby develop`, [not when running `gatsby build`](#no_files).

This means if they are not committed if someone was to checkout your project for the first time they would either run `gatsby build`, at it wouldn't work due to type errors. Or, they would run `gatsby develop` and be greeted by a large number of new files.

#### <u>Do I need these declaration files?</u>

No.

Well, maybe. You can have type safe css without these declaration files using [typescript-plugin-css-modules](https://github.com/mrmckeb/typescript-plugin-css-modules) in your `tsconfig.json`. However, this is only a development aid and wont throw any errors when actually building your site.

Generated declaration files will throw errors during `gatsby build` assuming all the files have been generated before any new changes to the scss. This is the safest way I know to use gatsby, scss modules and typescript all in one plug(-in) and play manor. I understand if the overload of file generation is too much for some, and is **not** a requirement for using scss and typescript.

For those who prefer to throw caution to the wind, you can use this:

```ts
declare module '*.scss' {
    const content: { [className: string]: string };

    export default content;
}
```

You animal. 🦁


#### <u>I'm not seeing any files being created?</u><a name="no_files"></a>

Firstly make sure your file are suffixed with `.module.scss`, the plugin won't generate declarations for regular `.scss` files by design. This is to give the most power to you!

Also, declaration files aren't generated for all scenarios. This is a development aid plugin, which means the files are only generated in development, not production. 

In production the loader is swapped out to improve performance. This means filse will only be generated when you are running `gatsby develop`, but changes to files will be picked up and amended during hot reloading.

Ultimately this can lead to small difference between the `gatsby develop` output and `gatsby build`. This tends to be a bug with [typescript-plugin-css-modules](https://github.com/mrmckeb/typescript-plugin-css-modules).

#### <u>Do I need any other gatsby plugins to enable scss with my project?</u>

No, and make sure you don't have other scss plugins like `gatsby-plugin-sass` installed, they'll just disagree. `gatsby-plugin-scss-typescript` achieves the same thing plus the type generation.

You will need `node-sass` as a dependency of your project though!