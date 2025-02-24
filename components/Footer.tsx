import { FC } from 'react';
import { Footer as ShadcnFooter } from 'shadcn-ui';
import { Book, Twitter, Linkedin, Github, Mail, Heart } from 'lucide-react';
import Link from 'next/link';
import { ComponentBaseProps } from '../types';

interface FooterProps extends ComponentBaseProps {
  showSocialLinks?: boolean;
}

const Footer: FC<FooterProps> = ({ showSocialLinks = true, className }) => {
  const currentYear = new Date().getFullYear();

  return (
    <ShadcnFooter className={`bg-surface border-t border-gray-200 dark:border-gray-800 ${className}`}>
      // ...existing JSX code...
    </ShadcnFooter>
  );
};

export default Footer;