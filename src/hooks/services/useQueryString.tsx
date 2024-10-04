import { useSearchParams } from "react-router-dom";

const useQueryString = <T extends Record<string, any>>(): T => {
    const [searchParams] = useSearchParams();
    return Object.fromEntries(searchParams) as T;
};

export default useQueryString;