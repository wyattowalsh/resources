import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import '../styles/globals.css';
import '../styles/custom.css';

const AccessibilityEnhancements = () => {
  const router = useRouter();

  useEffect(() => {
    // Add ARIA attributes to improve screen reader compatibility
    document.querySelectorAll('a').forEach((link) => {
      link.setAttribute('role', 'link');
      link.setAttribute('aria-label', link.textContent);
    });

    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('user-is-tabbing');
      }
    });

    // Remove keyboard navigation support class on mouse click
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('user-is-tabbing');
    });

    // Add focus styles for keyboard navigation
    const style = document.createElement('style');
    style.innerHTML = `
      .user-is-tabbing a:focus {
        outline: 2px solid #0070f3;
        outline-offset: 2px;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener('keydown', () => {});
      document.removeEventListener('mousedown', () => {});
      document.head.removeChild(style);
    };
  }, [router]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="accessibility-enhancements">
        <h2 className="text-2xl font-bold mb-4">Accessibility Enhancements</h2>
        <p className="mb-4">
          This component adds ARIA attributes and keyboard navigation support to improve accessibility.
        </p>
      </div>
    </motion.div>
  );
};

export default AccessibilityEnhancements;
