import { useState, useEffect, useMemo } from 'react';

export const searchDelay = 1000;

// Define the type for the value, which can be generic
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    const memoizedValue = useMemo(() => value, [value]); // Memoize the value to optimize unnecessary recalculation

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(memoizedValue), delay);

        return () => clearTimeout(handler);
    }, [memoizedValue, delay]); // Now using memoizedValue instead of value

    return debouncedValue;
}

export default useDebounce;
