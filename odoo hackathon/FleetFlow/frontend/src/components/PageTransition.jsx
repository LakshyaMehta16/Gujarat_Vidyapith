import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
    return (
        <motion.div
            initial={{
                opacity: 0,
                filter: 'blur(20px) drop-shadow(0 20px 50px #ff5e00) brightness(2) contrast(1.5)',
                scale: 0.95,
                y: 20
            }}
            animate={{
                opacity: 1,
                filter: 'blur(0px) drop-shadow(0 0px 0px transparent) brightness(1) contrast(1)',
                scale: 1,
                y: 0
            }}
            exit={{
                opacity: 0,
                filter: 'blur(30px) drop-shadow(0 -50px 100px #ff0000) brightness(2.5) contrast(2)',
                scale: 1.05,
                y: -30
            }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="h-full w-full origin-bottom"
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
