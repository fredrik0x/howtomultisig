
import React from 'react';
import { motion } from "framer-motion";

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/15 to-transparent dark:from-primary/5 pointer-events-none" />
      
      <div className="section-container pt-20 pb-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground dark:text-white">
              How to Multisig
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground dark:text-nord-4 mb-8 max-w-2xl mx-auto">
              Best practices on how to implement secure standard operation procedures for multisigs.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
