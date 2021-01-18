// eslint-disable-next-line @typescript-eslint/tslint/config
import 'core-js/stable';

import { RuleSetLoader } from 'webpack';

export const onCreateWebpackConfig = ({ stage, plugins, rules, actions }, options) => {
    const { setWebpackConfig } = actions;
    const isProduction = !stage.includes('develop');

    const {
        cssMinifyOptions,
        cssExtractOptions,
        cssLoaderOptions,
        sassLoaderOptions,
        declarationOptions,
    } = options;

    const typeLoader = {
        loader: '@teamsupercell/typings-for-css-modules-loader',
        options: declarationOptions,
    };

    const useCss: RuleSetLoader[] = rules.css(cssLoaderOptions).use;
    const useCssModules: RuleSetLoader[] = rules.cssModules(cssLoaderOptions).use;

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

    const isCssLoader = ({ loader }: RuleSetLoader) =>
        !!['/css-loader/', '\\css-loader\\'].find(matcher => loader.includes(matcher));

    const css = useCss.concat(sassLoaders);
    const cssModules = useCssModules
        .flatMap(loader => (isCssLoader(loader) ? [typeLoader, loader] : loader))
        .concat(sassLoaders);

    switch (stage) {
        case 'develop':
        case 'build-javascript':
        case 'build-html':
        case 'develop-html': {
            setWebpackConfig({
                module: {
                    rules: [
                        {
                            oneOf: [
                                {
                                    test: /\.module\.s(a|c)ss$/,
                                    use: cssModules,
                                },
                                {
                                    test: /\.s(a|c)ss$/,
                                    use: css,
                                },
                            ],
                        },
                    ],
                },
                optimization: {
                    minimizer: [plugins.minifyCss(cssMinifyOptions)],
                },
                plugins: [
                    plugins.extractText(cssExtractOptions),
                    plugins.ignore(/css\.d\.ts$/),
                ],
            });
        }
    }
};
