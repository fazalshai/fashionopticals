import React, { useState } from 'react';
import { Glasses, Stethoscope, Calendar, Phone, ShieldCheck, Menu, X } from 'lucide-react';

export const Header = ({ onBookClick, onAdminToggle, isAdminView }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="header-nav">
      {/* Top Banner Bar */}
      <div className="top-banner">
        <div className="container top-banner-container">
          <div className="top-info">
            <span className="info-item">
              <Stethoscope size={14} className="icon-gold" />
              <strong>Dr. Vuyyuru Raja Sekhar (MBBS, MS)</strong> — Ophthalmologist (38+ Yrs Exp)
            </span>
            <span className="info-divider">|</span>
            <span className="info-item">
              <Calendar size={14} className="icon-blue" />
              <strong>OPD Hours:</strong> Mon - Sat: 09:00 AM - 01:00 PM (Closed Sun)
            </span>
          </div>

          <div className="top-actions">
            <a href="tel:+918512830995" className="top-link">
              <Phone size={13} />
              +91 8512830995
            </a>
            <button 
              onClick={onAdminToggle} 
              className={`admin-toggle-btn ${isAdminView ? 'active' : ''}`}
              title="Toggle Staff/Clinic Admin Dashboard"
            >
              <ShieldCheck size={14} />
              {isAdminView ? "Exit Admin Mode" : "Staff Admin Login"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="main-navbar">
        <div className="container navbar-container">
          <a href="#" className="brand-logo">
            <div className="logo-icon-wrap">
              <Glasses size={26} className="logo-icon-front" />
              <span className="logo-cross">+</span>
            </div>
            <div className="logo-text">
              <span className="brand-title">FASHION OPTICALS</span>
              <span className="brand-subtitle">& EYE CLINIC</span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="nav-menu">
            <button onClick={() => scrollToSection('home')} className="nav-link">Home</button>
            <button onClick={() => scrollToSection('doctor')} className="nav-link">Doctor Profile</button>
            <button onClick={() => scrollToSection('services')} className="nav-link">Eye Care</button>
            <button onClick={() => scrollToSection('opticals')} className="nav-link">Opticals Store</button>
            <button onClick={() => scrollToSection('contact')} className="nav-link">Location & Contact</button>
          </div>

          {/* Header Action Button */}
          <div className="nav-actions">
            <button onClick={onBookClick} className="btn btn-primary nav-cta pulse-glow">
              <Calendar size={16} />
              Book Appointment
            </button>

            <button 
              className="mobile-hamburger" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="mobile-dropdown animate-fade-in">
            <button onClick={() => scrollToSection('home')} className="mobile-nav-link">Home</button>
            <button onClick={() => scrollToSection('doctor')} className="mobile-nav-link">Doctor Profile</button>
            <button onClick={() => scrollToSection('services')} className="mobile-nav-link">Eye Care Services</button>
            <button onClick={() => scrollToSection('opticals')} className="mobile-nav-link">Opticals Store</button>
            <button onClick={() => scrollToSection('contact')} className="mobile-nav-link">Location & Contact</button>
            <div className="mobile-actions">
              <button onClick={() => { setMobileMenuOpen(false); onBookClick(); }} className="btn btn-primary w-full">
                <Calendar size={16} />
                Book Consultation
              </button>
              <button onClick={() => { setMobileMenuOpen(false); onAdminToggle(); }} className="btn btn-secondary w-full">
                <ShieldCheck size={16} />
                {isAdminView ? "Exit Admin" : "Staff Admin Login"}
              </button>
            </div>
          </div>
        )}
      </nav>

      <style>{`
        .header-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: #ffffff;
          box-shadow: var(--shadow-sm);
        }
        .top-banner {
          background: var(--primary-navy);
          color: #94a3b8;
          font-size: 0.82rem;
          padding: 0.4rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .top-banner-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .top-info {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }
        .info-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          color: #e2e8f0;
        }
        .info-item strong {
          color: #ffffff;
        }
        .icon-gold { color: #f59e0b; }
        .icon-blue { color: #38bdf8; }
        .info-divider { color: #475569; }
        .top-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .top-link {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          color: #38bdf8;
          font-weight: 600;
        }
        .top-link:hover { text-decoration: underline; }
        .admin-toggle-btn {
          background: rgba(255, 255, 255, 0.1);
          color: #f8fafc;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-sm);
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          transition: all 0.2s ease;
        }
        .admin-toggle-btn:hover, .admin-toggle-btn.active {
          background: var(--accent-gold);
          border-color: var(--accent-gold);
          color: #ffffff;
        }
        .main-navbar {
          background: #ffffff;
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--border-light);
        }
        .navbar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .brand-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .logo-icon-wrap {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #0b132b 0%, #0284c7 100%);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          position: relative;
          box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25);
        }
        .logo-cross {
          position: absolute;
          top: 2px;
          right: 4px;
          font-size: 14px;
          font-weight: 800;
          color: #f59e0b;
        }
        .logo-text {
          display: flex;
          flex-direction: column;
        }
        .brand-title {
          font-family: var(--font-heading);
          font-size: 1.2rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--primary-navy);
          line-height: 1;
        }
        .brand-subtitle {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: var(--accent-blue);
        }
        .nav-menu {
          display: flex;
          align-items: center;
          gap: 1.75rem;
        }
        .nav-link {
          background: none;
          border: none;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-dark);
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .nav-link:hover {
          color: var(--accent-blue);
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .mobile-hamburger {
          display: none;
          background: none;
          border: none;
          color: var(--primary-navy);
          cursor: pointer;
        }
        .mobile-dropdown {
          display: flex;
          flex-direction: column;
          padding: 1rem;
          background: #ffffff;
          border-top: 1px solid var(--border-light);
          gap: 0.75rem;
        }
        .mobile-nav-link {
          text-align: left;
          background: none;
          border: none;
          font-size: 1rem;
          font-weight: 600;
          padding: 0.5rem;
          color: var(--text-dark);
        }
        .mobile-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        .w-full { width: 100%; }

        @media (max-width: 992px) {
          .top-info { display: none; }
          .nav-menu { display: none; }
          .mobile-hamburger { display: block; }
        }
      `}</style>
    </header>
  );
};
