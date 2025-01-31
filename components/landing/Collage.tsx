"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const CreativeCollage = () => {
  return (
    <div className="relative w-full rounded-2xl aspect-[2/5] md:aspect-[3/4] max-w-4xl mx-auto overflow-hidden p-8">
      {/* First Image - Top Left */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05, rotate: -18 }}
        transition={{ duration: 0.6 }}
        className="absolute top-[24%] left-12 w-full max-w-lg rotate-[-15deg] z-10"
      >
        <Image
          src="/input.png"
          alt="Input"
          width={1200}
          height={900}
          className="w-full h-full object-cover rounded-xl shadow-2xl border-4 border-white"
          priority
        />
      </motion.div>

      {/* Second Image - Top Right */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05, rotate: 12 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute top-[40%] right-[1%] w-full max-w-[450px] rotate-[9deg] z-20"
      >
        <Image
          src="/analyze.png"
          alt="Analyze"
          width={1200}
          height={900}
          className="w-full h-full object-cover rounded-xl shadow-2xl border-4 border-white"
          priority
        />
      </motion.div>

      {/* Third Image - Bottom Left */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05, rotate: -6 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="absolute bottom-[5%] left-0 w-full max-w-[450px] rotate-[-8deg] z-30"
      >
        <Image
          src="/output.png"
          alt="Output"
          width={1200}
          height={900}
          className="w-full h-full v rounded-xl shadow-2xl border-4 border-white"
        />
      </motion.div>

      {/* Fourth Image - Bottom Right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05, rotate: 20 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="absolute -bottom-12 -right-12 w-full max-w-[450px] rotate-[17deg] z-40"
      >
        <Image
          src="/data.png"
          alt="Data"
          width={1200}
          height={900}
          className="w-full h-full object-cover rounded-xl shadow-2xl border-4 border-white"
        />
      </motion.div>
    </div>
  )
}

export default CreativeCollage