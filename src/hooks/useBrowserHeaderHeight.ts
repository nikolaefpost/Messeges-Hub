import { useEffect, useState } from 'react';

export const useBrowserHeaderHeight = () =>  {
    const [browserHeaderHeight, setBrowserHeaderHeight] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPosition = window.scrollY;
            const scrollDirection = currentScrollPosition > previousScrollPosition ? 'down' : 'up';
            if (scrollDirection === 'down') {
                setBrowserHeaderHeight(0); // Assuming the browser header is hidden
            } else {
                setBrowserHeaderHeight(window.outerHeight - window.innerHeight);
            }
            previousScrollPosition = currentScrollPosition;
        };

        let previousScrollPosition = window.scrollY;
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return browserHeaderHeight
}