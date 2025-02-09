"use client";

import { SearchInput } from "@/components/search-input";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      ease: "easeOut",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99], // Custom easing curve
    },
  },
};

export function SearchSection() {
  const router = useRouter();

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-[30vh] relative overflow-visible">
      <div className="relative container mx-auto px-4 py-8 pb-4">
        <motion.div 
          className="max-w-3xl mx-auto text-center space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="space-y-4">
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-6xl font-bold gradient-text"
            >
              Find AI You Can Trust
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-xl text-muted-foreground"
            >
              Discover and share insights on the best AI tools
            </motion.p>
          </div>
          
          <motion.div 
            variants={itemVariants}
            className="relative"
          >
            <SearchInput onSearch={handleSearch} />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center"
          >
            <Link href="/tool/new" className="group">
              <div className="text-muted-foreground hover:text-primary transition-colors">
                <span className="text-sm">Missing an AI tool? Add it in seconds!</span>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 