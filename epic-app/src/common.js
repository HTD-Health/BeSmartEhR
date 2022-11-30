import {useLocation} from "react-router-dom";
import {useMemo} from "react";

export const redirectUrl = 'http://localhost:3000';
export const clientId = "9976354f-e38c-406e-9827-3b7ede3e2061";

export const useQuery = () => {
    const {search} = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}