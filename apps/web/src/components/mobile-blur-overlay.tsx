"use client";

import { isMobileMenuOpenAtom } from '@/atoms/mobile-menu';
import { AnimatePresence, motion } from 'framer-motion';
import { useAtom } from 'jotai';

export function MobileBlurOverlay() {
  const [isOpen] = useAtom(isMobileMenuOpenAtom);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[90] bg-white/80 backdrop-blur-md md:hidden"
        />
      )}
    </AnimatePresence>
  );
}