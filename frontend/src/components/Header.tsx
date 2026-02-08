'use client';

import { Brain, MessageCircle, LayoutDashboard, Home, Menu, X, UserCircle2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import styles from './Header.module.css';

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => pathname === path;
  
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);
  
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.navContainer} dir="rtl">
          <div className={styles.logoContainer}>
            <div className={styles.logoIcon}>
              <Brain />
            </div>
            <span className={styles.logoText}>روان‌یار</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className={styles.navDesktop}>
            <Link
              href="/auth"
              className={`${styles.navButton} ${
                isActive('/auth') ? styles.navButtonActive : styles.navButtonInactive
              }`}
            >
              <span>ورود / ثبت‌نام</span>
              <UserCircle2 />
            </Link>

            <Link
              href="/home"
              className={`${styles.navButton} ${
                isActive('/home') ? styles.navButtonActive : styles.navButtonInactive
              }`}
            >
              <span>خانه</span>
              <Home />
            </Link>
            
            <Link
              href="/chat"
              className={`${styles.navButton} ${
                isActive('/chat') ? styles.navButtonActive : styles.navButtonInactive
              }`}
            >
              <span>گفتگو</span>
              <MessageCircle />
            </Link>
            
            <Link
              href="/dashboard"
              className={`${styles.navButton} ${
                isActive('/dashboard') ? styles.navButtonActive : styles.navButtonInactive
              }`}
            >
              <span>پنل درمانگر</span>
              <LayoutDashboard />
            </Link>
          </nav>
          
          {/* Mobile Hamburger Button */}
          <button 
            className={styles.hamburger}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
        
        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <nav className={styles.navMobile} dir="rtl">
            <Link
              href="/auth"
              className={`${styles.navButton} ${
                isActive('/auth') ? styles.navButtonActive : styles.navButtonInactive
              }`}
              onClick={closeMobileMenu}
            >
              <span>ورود / ثبت‌نام</span>
              <UserCircle2 />
            </Link>

            <Link
              href="/home"
              className={`${styles.navButton} ${
                isActive('/home') ? styles.navButtonActive : styles.navButtonInactive
              }`}
              onClick={closeMobileMenu}
            >
              <span>خانه</span>
              <Home />
            </Link>
            
            <Link
              href="/chat"
              className={`${styles.navButton} ${
                isActive('/chat') ? styles.navButtonActive : styles.navButtonInactive
              }`}
              onClick={closeMobileMenu}
            >
              <span>گفتگو</span>
              <MessageCircle />
            </Link>
            
            <Link
              href="/dashboard"
              className={`${styles.navButton} ${
                isActive('/dashboard') ? styles.navButtonActive : styles.navButtonInactive
              }`}
              onClick={closeMobileMenu}
            >
              <span>پنل درمانگر</span>
              <LayoutDashboard />
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}