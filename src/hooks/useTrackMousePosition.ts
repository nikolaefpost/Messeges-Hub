import {RefObject, useEffect, useState} from "react";

export interface IPosition {
    x: number;
    y: number;
}
export const useTrackMousePosition = (setOpenMenu: (arg: boolean) => void) => {
    const [initialPosition, setInitialPosition] = useState<{ x: number | null; y: number | null }>({x: null, y: null});

    useEffect(() => {
        function handleMouseMove(event: MouseEvent) {
            const mouseX = event.clientX;
            const mouseY = event.clientY;

            if (initialPosition.x === null || initialPosition.y === null) {
                // Set initial position if it's not set yet
                setInitialPosition({x: mouseX, y: mouseY});
            } else {
                // Calculate distance from initial position
                const dx = Math.abs(mouseX - initialPosition.x);
                const dy = Math.abs(mouseY - initialPosition.y);

                // Check if movement exceeds 50 pixels in either direction
                if (dx > 50 || dy > 50) {
                    setOpenMenu(false);
                }
            }
        }

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [initialPosition, setOpenMenu]);
}

export const useMousePosition = (containerRef: RefObject<HTMLElement>): IPosition => {
    const [position, setPosition] = useState({ x: 0, y: 0 });



    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (containerRef.current) {
                const containerRect = containerRef.current.getBoundingClientRect();
                setPosition({
                    x: e.clientX - containerRect.left,
                    y: e.clientY - containerRect.top
                });
            }
        };
        document.addEventListener("mousemove", handleMouseMove);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
        };
    }, [containerRef]);

    return position;
}

