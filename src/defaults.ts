const defaultOptions = {
    modules: true,
};

const getDefaultModuleOptions = (useModules: boolean) => {
    return useModules
        ? {
              camelCase: true,
              namedExport: true,
              localIdentName: '[local]__[hash:base64:5]',
          }
        : {};
};

export const defaults = (useModules: boolean) => ({
    ...defaultOptions,
    ...getDefaultModuleOptions(useModules),
});
