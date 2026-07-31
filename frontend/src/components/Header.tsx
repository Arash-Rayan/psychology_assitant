'use client';

import { MessageCircle, LayoutDashboard, Home, Menu, X, UserCircle2, Info, Stethoscope } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Logo } from './Logo';
import styles from './Header.module.css';

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) =>
    path === '/doctors' ? pathname === '/doctors' || pathname.startsWith('/doctors/') : pathname === path;
  
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);
  
  return (
    <>
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.navContainer} dir="rtl">
          <Link href="/home" className={styles.logoLink} aria-label="روانصد — صفحه اصلی">
            <Logo size="md" showText priority />
          </Link>
          
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
              href="/about"
              className={`${styles.navButton} ${
                isActive('/about') ? styles.navButtonActive : styles.navButtonInactive
              }`}
            >
              <span>درباره ما</span>
              <Info />
            </Link>

            <Link
              href="/doctors"
              className={`${styles.navButton} ${
                isActive('/doctors') ? styles.navButtonActive : styles.navButtonInactive
              }`}
            >
              <span>درمانگران</span>
              <Stethoscope />
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

            {/* Profile Button */}
            <Link
              href="/profile"
              className={styles.profileBtn}
              aria-label="پروفایل من"
            >
              <span className={styles.profileAvatar}>سا</span>
            </Link>
          </nav>
          
          {/* Mobile Profile + Hamburger */}
          <div className={styles.mobileActions}>
            <Link
              href="/profile"
              className={styles.profileBtn}
              aria-label="پروفایل من"
            >
              <span className={styles.profileAvatar}>سا</span>
            </Link>
            <button 
              className={styles.hamburger}
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
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
              href="/about"
              className={`${styles.navButton} ${
                isActive('/about') ? styles.navButtonActive : styles.navButtonInactive
              }`}
              onClick={closeMobileMenu}
            >
              <span>درباره ما</span>
              <Info />
            </Link>

            <Link
              href="/doctors"
              className={`${styles.navButton} ${
                isActive('/doctors') ? styles.navButtonActive : styles.navButtonInactive
              }`}
              onClick={closeMobileMenu}
            >
              <span>درمانگران</span>
              <Stethoscope />
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
    {/* جبران ارتفاع هدر ثابت تا محتوا زیر نوار بالا نرود */}
    <div className={styles.headerSpacer} aria-hidden />
    </>
  );
}