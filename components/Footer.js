import { Footer as ShadcnFooter, FooterLink } from 'shadcn-ui';
import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <ShadcnFooter className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-sm">
          &copy; {new Date().getFullYear()} Resource Collection. All rights reserved.
        </div>
        <div className="flex space-x-4">
          <FooterLink href="https://twitter.com/yourprofile" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </FooterLink>
          <FooterLink href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </FooterLink>
          <FooterLink href="https://github.com/yourprofile" target="_blank" rel="noopener noreferrer">
            <FaGithub />
          </FooterLink>
        </div>
      </div>
    </ShadcnFooter>
  );
};

export default Footer;
