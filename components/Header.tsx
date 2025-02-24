import { FC, useState, useEffect } from 'react';
import { Navbar, NavItem, Button } from 'shadcn-ui';
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

  // ...existing JSX code...
};

export default Header;