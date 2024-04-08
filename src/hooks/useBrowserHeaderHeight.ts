import { useEffect, useState } from 'react';

export const useBrowserHeaderHeight = () =>  {
    const [browserHeaderHeight, setBrowserHeaderHeight] = useState(0);

    useEffect(() => {
        console.log(window.outerHeight + "IN" + window.innerHeight)
        setBrowserHeaderHeight(window.outerHeight - window.innerHeight);
    }, []);

    return browserHeaderHeight
}