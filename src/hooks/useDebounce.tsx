import { useState, useEffect } from 'react';
export const searchDelay = 1000
// Define the type for the value, which can be generic
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);

        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}

export default useDebounce;
