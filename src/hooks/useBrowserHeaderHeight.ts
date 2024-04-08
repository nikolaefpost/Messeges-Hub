import {  useState, useLayoutEffect } from 'react';

export const useBrowserHeight = () => {
    const [browserHeaderHeight, setBrowserHeaderHeight] = useState(0);

    useLayoutEffect(() => {
        const updateHeight = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            setBrowserHeaderHeight(documentHeight - windowHeight);
        };

        // Initial height calculation
        updateHeight();

        // Update height on resize and orientation change
        const debouncedUpdateHeight = debounce(updateHeight, 100); // Adjust debounce time as needed
        window.addEventListener('resize', debouncedUpdateHeight);
        window.addEventListener('orientationchange', debouncedUpdateHeight);

        // Cleanup
        return () => {
            window.removeEventListener('resize', debouncedUpdateHeight);
            window.removeEventListener('orientationchange', debouncedUpdateHeight);
        };
    }, []);

    return browserHeaderHeight;
};

function debounce<T extends (...args: never[]) => void>(func: T, wait: number) {
    let timeout: NodeJS.Timeout | undefined;

    return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
        const context = this as ThisParameterType<T>;
        const later = () => {
            timeout = undefined;
            func.apply(context, args);
        };

        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(later, wait) as unknown as NodeJS.Timeout;
    };
}