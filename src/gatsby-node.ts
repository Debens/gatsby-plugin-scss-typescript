// eslint-disable-next-line @typescript-eslint/tslint/config
import 'core-js/stable';

import { RuleSetUseItem } from 'webpack';

type ObjectRule = Exclude<RuleSetUseItem, string | Function>;

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

    const typeLoader: ObjectRule = {
        loader: '@teamsupercell/typings-for-css-modules-loader',
        options: declarationOptions,
    };

    const useCss: ObjectRule[] = rules.css(cssLoaderOptions).use;
    const useCssModules: ObjectRule[] = rules.cssModules(cssLoaderOptions).use;

    const sassLoaders: ObjectRule[] = [
        { loader: 'resolve-url-loader' },
        {
            loader: 'sass-loader',
            options: {
                sourceMap: !isProduction,
                ...sassLoaderOptions,
            },
        },
    ];

    const isCssLoader = ({ loader }: ObjectRule) =>
        !!['/css-loader/', '\\css-loader\\'].find(matcher => loader.includes(matcher));

    /**
     * https://github.com/TeamSupercell/typings-for-css-modules-loader/blob/master/src/index.js#L64-L66
     *
     * TeamSupercell use the locals property in the named exports.
     *
     * Sadly this means we have to disable the tree shaking when generating the typings to allow the typings generation.
     * This wil have no effect on the actual tree-shaking of course
     */
    const toDisabledTreeShaking = loader => ({
        ...loader,
        options: {
            ...loader.options,
            modules: {
                ...loader.options.modules,
                namedExport: false,
            },
        },
    });

    const css = useCss.concat(sassLoaders);
    const cssModules = useCssModules
        .flatMap(loader =>
            isCssLoader(loader) ? [typeLoader, toDisabledTreeShaking(loader)] : loader,
        )
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
