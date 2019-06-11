import { RuleSetRule, Plugin } from 'webpack';

const createLoaders = (
    sassLoader: RuleSetRule,
    cssLoaders: RuleSetRule[],
): RuleSetRule[] => [...cssLoaders, { loader: 'resolve-url-loader' }, sassLoader];

export const onCreateWebpackConfig = ({ stage, loaders, plugins, actions }, options) => {
    const { setWebpackConfig } = actions;
    const isProduction = !stage.includes('develop');

    const {
        stylePluginOptions,
        styleLoaderOptions,
        cssLoaderOptions,
        sassLoaderOptions,
    } = options;

    const stylePlugin: Plugin = plugins.extractText(stylePluginOptions);
    const styleLoader: RuleSetRule = loaders.miniCssExtract(styleLoaderOptions);

    const cssModuleLoader: RuleSetRule = {
        loader: 'typings-for-css-modules-loader',
        options: {
            modules: true,
            camelCase: true,
            namedExport: true,
            localIdentName: '[local]__[hash:base64:5]',
            ...cssLoaderOptions,
        },
    };

    const sassLoader: RuleSetRule = {
        loader: 'sass-loader',
        options: {
            sourceMap: !isProduction,
            ...sassLoaderOptions,
        },
    };

    switch (stage) {
        case 'develop':
        case 'develop-html':
        case 'build-css':
        case 'build-html':
        case 'build-javascript': {
            setWebpackConfig({
                plugins: [stylePlugin],
                module: {
                    rules: [
                        {
                            oneOf: [
                                {
                                    test: /\.module\.s(a|c)ss$/,
                                    use: createLoaders(sassLoader, [
                                        styleLoader,
                                        cssModuleLoader,
                                    ]),
                                },
                                {
                                    test: /\.s(a|c)ss$/,
                                    use: createLoaders(sassLoader, [
                                        styleLoader,
                                        loaders.css(cssLoaderOptions),
                                    ]),
                                },
                            ],
                        },
                    ],
                },
            });
        }
    }
};
