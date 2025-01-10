export const getQueryKeys = (params: Record<string, any> = {}) => {
    return Object.values(params);
};

export const parserParams = (targets: { compare: any; target: Record<string, any> }[]) => {
    if (targets.length === 0) return {};

    return targets.reduce((acc, { compare, target }) => {
        const resultTarget = Object.entries(target).reduce((acc, [key, value]) => {
            if (value !== compare) {
                acc[key] = value;
            }
            return acc;
        }, {});

        return { ...acc, ...resultTarget };
    }, {} as Record<string, any>);
};

export const getLabelFromOptions = (options, value) => {
    const foundOption = options.find(option => option.value === value);
    return foundOption ? foundOption.label : value;
};

export const formatPrice = (price: number, locale: string = 'vi-VN', currency: string = 'VND'): string => {
    if (isNaN(price)) return '0 ₫';
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};