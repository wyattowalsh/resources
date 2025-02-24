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
    <footer className={`bg-pantone-classic-blue text-white border-t border-pantone-ultimate-gray ${className}`}>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl font-bold text-white">
              <Book className="inline-block w-6 h-6 mr-2" />
              Resource Collection
            </Link>
          </div>
          {showSocialLinks && (
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="https://twitter.com" target="_blank" className="text-white hover:text-pantone-living-coral transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="https://linkedin.com" target="_blank" className="text-white hover:text-pantone-living-coral transition-colors">
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link href="https://github.com" target="_blank" className="text-white hover:text-pantone-living-coral transition-colors">
                <Github className="w-5 h-5" />
              </Link>
              <Link href="mailto:someone@example.com" className="text-white hover:text-pantone-living-coral transition-colors">
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
        <div className="mt-4 text-center text-sm text-white">
          <p>&copy; {currentYear} Resource Collection. All rights reserved.</p>
          <p className="mt-2">
            Made with <Heart className="inline-block w-4 h-4 text-pantone-living-coral" /> by the Resource Collection team.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
