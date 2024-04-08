import {  useState, useLayoutEffect } from 'react';

export const useScreenHeight = () => {
    const [screenHeight, setScreenHeight] = useState(0);

    useLayoutEffect(() => {
        const updateHeight = () => {
            setScreenHeight(screen.height);
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

    return screenHeight;
};

// Debounce utility function
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