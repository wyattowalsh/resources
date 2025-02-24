import { FC, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { ComponentBaseProps } from '../types';
import '../styles/globals.css';
import '../styles/custom.css';

interface AccessibilityStyles {
  focus: string;
  outline: string;
  skip: string;
}

interface AccessibilityEnhancementsProps extends ComponentBaseProps {
  customStyles?: Partial<AccessibilityStyles>;
  enableSkipLink?: boolean;
}

const defaultStyles: AccessibilityStyles = {
  focus: `
    .user-is-tabbing a:focus,
    .user-is-tabbing button:focus,
    .user-is-tabbing input:focus,
    .user-is-tabbing select:focus,
    .user-is-tabbing textarea:focus {
      outline: 2px solid var(--primary);
      outline-offset: 2px;
      box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
    }
  `,
  outline: `
    *:focus {
      outline: none;
    }
  `,
  skip: `
    .skip-link {
      position: fixed;
      top: -100%;
      left: 0;
      padding: 0.5rem 1rem;
      background: var(--primary);
      color: white;
      z-index: 9999;
      transition: top 0.2s;
    }
    .skip-link:focus {
      top: 0;
    }
  `
};

const AccessibilityEnhancements: FC<AccessibilityEnhancementsProps> = ({
  customStyles,
  enableSkipLink = true,
  className
}) => {
  const router = useRouter();

  useEffect(() => {
    // Add ARIA attributes to improve screen reader compatibility
    const enhanceLinks = (): void => {
      document.querySelectorAll('a').forEach((link) => {
        if (!link.getAttribute('aria-label')) {
          link.setAttribute('role', 'link');
          link.setAttribute('aria-label', link.textContent || '');
        }
      });
    };

    // Add keyboard navigation support
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Tab') {
        document.body.classList.add('user-is-tabbing');
      }
    };

    // Remove keyboard navigation support class on mouse click
    const handleMouseDown = (): void => {
      document.body.classList.remove('user-is-tabbing');
    };

    // Add accessibility styles
    const style = document.createElement('style');
    style.innerHTML = `
      ${defaultStyles.outline}
      ${customStyles?.outline || ''}
      ${defaultStyles.focus}
      ${customStyles?.focus || ''}
      ${enableSkipLink ? defaultStyles.skip : ''}
      ${customStyles?.skip || ''}
    `;
    document.head.appendChild(style);

    // Add skip link
    if (enableSkipLink) {
      const skipLink = document.createElement('a');
      skipLink.href = '#main-content';
      skipLink.className = 'skip-link';
      skipLink.textContent = 'Skip to main content';
      document.body.insertBefore(skipLink, document.body.firstChild);
    }

    // Initialize enhancements
    enhanceLinks();
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    // Reapply enhancements on route change
    router.events.on('routeChangeComplete', enhanceLinks);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
      document.head.removeChild(style);
      router.events.off('routeChangeComplete', enhanceLinks);
      
      // Remove skip link if it exists
      const skipLink = document.querySelector('.skip-link');
      if (skipLink) {
        skipLink.remove();
      }
    };
  }, [router, customStyles, enableSkipLink]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`accessibility-enhancements ${className ?? ''}`}
    >
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Accessibility Enhancements</h2>
        <p className="text-text-secondary">
          This component adds ARIA attributes, keyboard navigation support, and skip links to improve accessibility.
        </p>
        <ul className="list-disc list-inside space-y-2 text-text-secondary">
          <li>Enhanced keyboard navigation</li>
          <li>ARIA attributes for screen readers</li>
          <li>Skip navigation link</li>
          <li>Focus management</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default AccessibilityEnhancements;