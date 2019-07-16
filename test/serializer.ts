export const print = (value: string, serialize: (value: string) => string) => {
    return serialize(value.replace(process.cwd(), ''));
};

export const test = (value: unknown) =>
    typeof value === 'string' && value.includes(process.cwd());
