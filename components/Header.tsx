"use client"

import { FC, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Menu, X, Book, Search, Sun, Moon, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ComponentBaseProps } from '../types';

interface HeaderProps extends ComponentBaseProps {
  onThemeChange?: (isDark: boolean) => void;
}

const Header: FC<HeaderProps> = ({ onThemeChange, className }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = (): void => {
    const newThemeState = !isDark;
    setIsDark(newThemeState);
    document.documentElement.classList.toggle('dark');
    onThemeChange?.(newThemeState);
  };

  return (
    <header className={`fixed w-full z-30 transition-all ${isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'} ${className}`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-pantone-classic-blue">
          <Book className="inline-block w-6 h-6 mr-2" />
          Resource Collection
        </Link>
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/search" className="text-pantone-classic-blue hover:text-pantone-living-coral transition-colors">
            <Search className="inline-block w-5 h-5 mr-1" />
            Search
          </Link>
          <Button onClick={toggleTheme} className="p-2 rounded-full">
            {isDark ? <Sun className="w-5 h-5 text-pantone-illuminating" /> : <Moon className="w-5 h-5 text-pantone-ultra-violet" />}
          </Button>
          <Link href="https://github.com" target="_blank" className="text-pantone-classic-blue hover:text-pantone-living-coral transition-colors">
            <Github className="inline-block w-5 h-5" />
          </Link>
        </div>
        <Button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-full">
          {isOpen ? <X className="w-6 h-6 text-pantone-classic-blue" /> : <Menu className="w-6 h-6 text-pantone-classic-blue" />}
        </Button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-lg"
          >
            <ul className="space-y-4 p-4">
              <li>
                <Link href="/search" className="text-pantone-classic-blue hover:text-pantone-living-coral transition-colors">
                  <Search className="inline-block w-5 h-5 mr-1" />
                  Search
                </Link>
              </li>
              <li>
                <Button onClick={toggleTheme} className="p-2 rounded-full">
                  {isDark ? <Sun className="w-5 h-5 text-pantone-illuminating" /> : <Moon className="w-5 h-5 text-pantone-ultra-violet" />}
                </Button>
              </li>
              <li>
                <Link href="https://github.com" target="_blank" className="text-pantone-classic-blue hover:text-pantone-living-coral transition-colors">
                  <Github className="inline-block w-5 h-5" />
                </Link>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
