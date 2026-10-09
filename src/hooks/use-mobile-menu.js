import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function useMobileMenu() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  useEffect(
    () => {
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname]
  );

  const toggleMobileMenu = () => setIsMobileMenuOpen((prevIsOpen) => !prevIsOpen);

  return { isMobileMenuOpen, toggleMobileMenu };
}
