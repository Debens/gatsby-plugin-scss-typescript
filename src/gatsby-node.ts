import defaults from './defaults';
import resolve from './resolve';

export const onCreateWebpackConfig = ({ stage, actions }, options) => {
    const { setWebpackConfig } = actions;

    switch (stage) {
        case 'develop':
        case 'build-css':
        case 'develop-html':
        case 'build-html':
        case 'build-javascript': {
            setWebpackConfig({
                module: {
                    rules: [
                        {
                            test: /\.s(c|a)ss$/,
                            use: [
                                {
                                    loader: resolve('style-loader'), // creates style nodes from JS strings
                                },
                                {
                                    loader: resolve('typings-for-css-modules-loader'), // Generates .d.ts files for the .css files
                                    options: {
                                        ...defaults,
                                        ...options,
                                    },
                                },
                                {
                                    loader: resolve('resolve-url-loader'),
                                },
                                {
                                    loader: resolve('sass-loader'), // compiles Sass to CSS
                                },
                            ],
                        },
                    ],
                },
            });
        }
    }
};
