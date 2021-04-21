import { onCreateWebpackConfig } from './gatsby-node';

const rules = {
    css: args => ({
        test: /\.css$/,
        use: [
            { loader: require.resolve('style-loader') },
            { loader: require.resolve('css-loader'), options: args },
            { loader: require.resolve('sass-loader') },
        ],
    }),
    cssModules: args => ({
        test: /\.module\.css$/,
        use: [
            { loader: require.resolve('style-loader') },
						{ loader: require.resolve('dts-css-modules-loader') },
            {
                loader: require.resolve('css-loader'),
                options: { ...args, modules: true },
            },
            { loader: require.resolve('sass-loader') },	
        ],
    }),
};

const plugins = {
    extractText: args => `extractText(${JSON.stringify(args)})`,
    ignore: regex => `ignore(${regex})`,
    minifyCss: args => `minifyCss(${JSON.stringify(args)})`,
};

const actions = { setWebpackConfig: jest.fn() };

describe('gatsby-plugin-sass', () => {
    beforeEach(() => {
        actions.setWebpackConfig.mockReset();
    });

    const stages = ['develop', 'build-javascript', 'develop-html', 'build-html'];

    stages.forEach(stage => {
        describe(`given stage ${stage}`, () => {
            describe('when creating webpack config', () => {
                describe('and passing no options', () => {
                    it('then should configure the config', () => {
                        onCreateWebpackConfig({ actions, stage, rules, plugins }, {});
                        expect(actions.setWebpackConfig).toMatchSnapshot();
                    });
                });

                describe('sass loader options', () => {
                    const sassLoaderOptions = {
                        includePaths: ['absolute/path/a', 'absolute/path/b'],
                    };

                    it('then should configure the config', () => {
                        onCreateWebpackConfig(
                            { actions, stage, rules, plugins },
                            { sassLoaderOptions },
                        );
                        expect(actions.setWebpackConfig).toMatchSnapshot();
                    });
                });

                describe('css loader options', () => {
                    const cssLoaderOptions = {
                        importLoaders: 1,
                        localIdentName: '[name]_[local]___[hash:base64:5]_[emoji:1]',
                    };

                    it('then should configure the config', () => {
                        onCreateWebpackConfig(
                            { actions, stage, rules, plugins },
                            { cssLoaderOptions },
                        );
                        expect(actions.setWebpackConfig).toMatchSnapshot();
                    });
                });
            });
        });
    });
});
