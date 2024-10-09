import { useState, useEffect } from 'react';

const useDebounceArray = (values: string[], delay: number) => {
    const [debouncedValues, setDebouncedValues] = useState<string[]>(values);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValues(values);
        }, delay);

        return () => clearTimeout(handler);
    }, [values, delay]);

    return debouncedValues;
};

export default useDebounceArray;
