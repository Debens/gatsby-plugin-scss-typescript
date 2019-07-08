import { RuleSetLoader } from 'webpack';

export const onCreateWebpackConfig = ({ stage, plugins, rules, actions }, options) => {
    const { setWebpackConfig } = actions;
    const isProduction = !stage.includes('develop');

    const {
        cssMinifyOptions,
        cssExtractOptions,
        cssLoaderOptions,
        sassLoaderOptions,
    } = options;

    const useCss: RuleSetLoader[] = rules.css(cssLoaderOptions).use;
    const useCssModules: RuleSetLoader[] = rules.cssModules({
        camelCase: true,
        namedExport: true,
        ...cssLoaderOptions,
    }).use;

    useCssModules.map(loader => {
        ['/css-loader/locals', '/css-loader/'].forEach(modulePath => {
            if (loader.loader.includes(modulePath)) {
                loader.loader = require.resolve('typings-for-css-modules-loader');
            }
        });

        return loader;
    });

    const sassLoaders: RuleSetLoader[] = [
        { loader: 'resolve-url-loader' },
        {
            loader: 'sass-loader',
            options: {
                sourceMap: !isProduction,
                ...sassLoaderOptions,
            },
        },
    ];

    useCss.push(...sassLoaders);
    useCssModules.push(...sassLoaders);

    switch (stage) {
        case 'develop':
        case 'build-javascript':
        case 'build-html':
        case 'develop-html': {
            setWebpackConfig({
                optimization: {
                    minimizer: [plugins.minifyCss(cssMinifyOptions)],
                },
                plugins: [plugins.extractText(cssExtractOptions)],
                module: {
                    rules: [
                        {
                            oneOf: [
                                {
                                    test: /\.module\.s(a|c)ss$/,
                                    use: useCssModules,
                                },
                                {
                                    test: /\.s(a|c)ss$/,
                                    use: useCss,
                                },
                            ],
                        },
                    ],
                },
            });
        }
    }
};
