// eslint-disable-next-line @typescript-eslint/tslint/config
import 'core-js/stable';

import { RuleSetUseItem } from 'webpack';

type ObjectRule = Exclude<RuleSetUseItem, string | Function>;

// While `rules` isn't used here, we must have it around for tests
export const onCreateWebpackConfig = ({ stage, plugins, actions, rules }, options) => {
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
		loader: "dts-css-modules-loader",
		options: {
			namedExport: true,
			...declarationOptions
		}
	};
	const styleLoader: ObjectRule = {
		loader: "style-loader",
		options: {
			esModule: false,
		},
	};
	const cssLoader: ObjectRule = {
		loader: "css-loader",
		options: {
			...cssLoaderOptions,
			modules: {
				exportLocalsConvention: "camelCaseOnly",
				localIdentName: "[local]"
			}
		}
	};
	const sassLoader: ObjectRule = {
		loader: "sass-loader",
		options: {
			sourceMap: !isProduction,
			...sassLoaderOptions
		},
	};

	const sassLoaders: ObjectRule[] = [
		styleLoader,
		cssLoader,
		sassLoader
	];

	const typeLoaders: ObjectRule[] = [
		styleLoader,
		typeLoader,
		cssLoader,
		sassLoader
	];

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
									use: typeLoaders,
								},
								{
									test: /\.s(a|c)ss$/,
									use: sassLoaders,
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
