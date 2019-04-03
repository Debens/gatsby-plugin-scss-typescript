import { defaults } from './defaults';
import resolve from './resolve';

const createLoaders = (useModules: boolean, options: any, isProduction: boolean) => [
    {
        loader: resolve('style-loader'), // creates style nodes from JS strings
    },
    {
        loader: useModules
            ? resolve('typings-for-css-modules-loader')
            : resolve('css-loader'), // loads css
        options: {
            ...defaults(useModules),
            ...options,
        },
    },
    {
        loader: resolve('resolve-url-loader'),
    },
    {
        loader: resolve('sass-loader'), // compiles Sass to CSS
        options: {
            sourceMap: !isProduction,
        },
    },
];

export const onCreateWebpackConfig = ({ stage, actions }, options) => {
    const { setWebpackConfig } = actions;
    const isProduction = stage !== `develop`;

    const SCSSRules = {
        test: /\.s(a|c)ss$/,
        use: createLoaders(false, options, isProduction),
    };

    const SCSSModuleRules = {
        test: /\.module\.s(a|c)ss$/,
        use: createLoaders(true, options, isProduction),
    };

    switch (stage) {
        case 'develop':
        case 'build-css':
        case 'build-javascript': {
            setWebpackConfig({
                module: {
                    rules: [{ oneOf: [SCSSModuleRules, SCSSRules] }],
                },
            });
        }
    }
};
