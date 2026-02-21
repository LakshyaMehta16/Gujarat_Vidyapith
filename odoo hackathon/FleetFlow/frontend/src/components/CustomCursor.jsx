import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const updateMousePosition = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e) => {
            if (
                e.target.tagName.toLowerCase() === 'button' ||
                e.target.tagName.toLowerCase() === 'a' ||
                e.target.closest('button') ||
                e.target.closest('a')
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', updateMousePosition);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    const variants = {
        default: {
            x: mousePosition.x - 16,
            y: mousePosition.y - 16,
            scale: 1,
            opacity: 1,
        },
        hover: {
            x: mousePosition.x - 24,
            y: mousePosition.y - 24,
            scale: 1.5,
            backgroundColor: 'rgba(59, 130, 246, 0.2)', // blue-500 with opacity
            border: '1px solid rgba(59, 130, 246, 0.5)',
            opacity: 1,
        },
    };

    return (
        <>
            {/* Outer ring */}
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-blue-500 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
                variants={variants}
                animate={isHovering ? 'hover' : 'default'}
                transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 28,
                    mass: 0.5,
                }}
            />
            {/* Inner dot */}
            <motion.div
                className="fixed top-0 left-0 w-2 h-2 bg-blue-500 rounded-full pointer-events-none z-[10000] mix-blend-difference hidden md:block"
                animate={{
                    x: mousePosition.x - 4,
                    y: mousePosition.y - 4,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 1000,
                    damping: 28,
                    mass: 0.1,
                }}
            />
        </>
    );
};

export default CustomCursor;
