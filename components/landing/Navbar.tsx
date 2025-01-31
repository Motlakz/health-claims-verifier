"use client"

import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }} // Start off-screen and invisible
      animate={{ y: 0, opacity: 1 }} // Animate to visible and in place
      transition={{ duration: 0.8, ease: 'easeOut' }} // Smooth transition
      className="flex justify-between items-center p-4 backdrop-blur-md bg-white/30 shadow-lg rounded-lg border border-white/10"
    >
      <motion.h1
        whileHover={{ scale: 1.05 }} // Scale up on hover
        className="font-extrabold highlight-mini text-2xl text-orange-400 cursor-pointer"
      >
        Truth<span className="text-indigo-500">Fluencer</span>
      </motion.h1>

      <motion.div whileHover={{ scale: 1.05 }}>
        <Button asChild variant="ghost" className="text-indigo-500 hover:bg-indigo-500/10">
          <Link href="/dashboard/claims">Verify Health Claims Now <ArrowRight /></Link>
        </Button>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
