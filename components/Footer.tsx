import { FC } from 'react';
import Link from 'next/link';
import { Book, Twitter, Linkedin, Github, Mail, Heart } from 'lucide-react';
import { ComponentBaseProps } from '../types';

interface FooterProps extends ComponentBaseProps {
  showSocialLinks?: boolean;
}

const Footer: FC<FooterProps> = ({ showSocialLinks = true, className }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-surface border-t border-gray-200 dark:border-gray-800 ${className}`}>
      {/* ...existing code... */}
    </footer>
  );
};

export default Footer;