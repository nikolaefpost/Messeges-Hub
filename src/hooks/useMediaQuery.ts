import {useCallback, useEffect, useState} from "react";



export const useMediaQuery = (max: number, min: number | null) => {
    const [targetMax, setTargetMax] = useState(false);
    const [targetMin, setTargetMin] = useState(false);

    const updateMax = useCallback((e: MediaQueryListEvent) => {
        if (e.matches) setTargetMax(true);
        else setTargetMax(false);
    }, []);

    const updateMin = useCallback((e: MediaQueryListEvent) => {
        if (e.matches) setTargetMin(true);
        else setTargetMin(false);
    }, []);

    useEffect(() => {
        const media1 = window.matchMedia(`(max-width: ${max}px`)
        media1.addEventListener("change", updateMax);
        if (media1.matches) setTargetMax(true);
        let media2: MediaQueryList | undefined;

        if (min){
            media2 = window.matchMedia(`(min-width: ${min}px`)
            media2.addEventListener("change", updateMin);
            if (media2.matches) setTargetMin(true);
        }
        return () => {
            media1.removeEventListener("change", updateMax);
            if (media2) media2.removeEventListener("change", updateMin);
        };
    }, [max, min, updateMax, updateMin]);

    return min? targetMax && targetMin : targetMax;
};