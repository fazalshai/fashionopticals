import React from 'react';
import { Glasses, Phone, MapPin, ShieldCheck, Heart } from 'lucide-react';
import { DOCTOR_INFO } from '../data/mockData';

export const Footer = ({ onBookClick, onAdminToggle }) => {
  return (
    <footer className="site-footer">
      <div className="container">
        
        <div className="footer-grid">
          
          <div className="footer-col brand-col">
            <div className="brand-logo footer-logo">
              <div className="logo-icon-wrap">
                <Glasses size={26} />
                <span className="logo-cross">+</span>
              </div>
              <div className="logo-text">
                <span className="brand-title text-white">FASHION OPTICALS</span>
                <span className="brand-subtitle text-blue">& EYE CLINIC</span>
              </div>
            </div>

            <p className="footer-desc">
              Combining 38+ years of expert ophthalmology clinical care by <strong>Dr. Vuyyuru Raja Sekhar</strong> with premier fashion spectacles, blue-light computer glasses, and contact lenses.
            </p>

            <div className="medical-disclaimer-box">
              <ShieldCheck size={16} className="text-gold" />
              <span>Official Appointment Portal for Dr. Vuyyuru Raja Sekhar (MBBS, MS Ophthalmology).</span>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#doctor">Dr. Vuyyuru Raja Sekhar Profile</a></li>
              <li><a href="#services">Eye Care Services</a></li>
              <li><a href="#opticals">Opticals Catalog</a></li>
              <li><a href="#contact">Clinic Hours & Map</a></li>
              <li><button onClick={onAdminToggle} className="btn-link-admin">Staff Admin Portal Login</button></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Treatments Offered</h4>
            <ul className="footer-links">
              <li><span>Cataract & Phaco Surgery</span></li>
              <li><span>Glaucoma & Trabeculoplasty</span></li>
              <li><span>Cornea Transplant & Keratoplasty</span></li>
              <li><span>LASIK Laser Vision Correction</span></li>
              <li><span>Pterygium & Amblyopia Therapy</span></li>
              <li><span>Vitrectomy Retina Care</span></li>
            </ul>
          </div>

          <div className="footer-col contact-col">
            <h4>Clinic Desk Contact</h4>
            <div className="contact-item">
              <MapPin size={16} className="text-blue" />
              <span>Kanna Vari Thota, Opp Guntur Medical College Gate, AP</span>
            </div>
            <div className="contact-item">
              <Phone size={16} className="text-gold" />
              <span>+91 8512830995 (Call / WhatsApp)</span>
            </div>
            <div className="opd-pill-footer">
              <strong>Doctor OPD Timings:</strong>
              <p>Mon - Sat: 09:00 AM - 01:00 PM (Closed Sun)</p>
            </div>
            <button onClick={onBookClick} className="btn btn-gold btn-sm w-full mt-2">
              Book Appointment Now
            </button>
          </div>

        </div>

        <div className="footer-bottom">
          <p>© 2026 Fashion Opticals & Dr. Vuyyuru Raja Sekhar Eye Clinic. All Rights Reserved.</p>
          <p className="credit-text">Crafted with care for patient vision & healthcare excellence.</p>
        </div>

      </div>

      <style>{`
        .site-footer {
          background: #0b132b;
          color: #94a3b8;
          padding: 4rem 0 2rem 0;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.4fr 0.8fr 0.9fr 1fr;
          gap: 2.5rem;
          margin-bottom: 3rem;
        }
        .text-white { color: #ffffff; }
        .text-blue { color: #38bdf8; }
        .text-gold { color: #fbbf24; }
        .footer-logo { margin-bottom: 1.25rem; }
        .footer-desc {
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 1.25rem;
          color: #cbd5e1;
        }
        .medical-disclaimer-box {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
          font-size: 0.78rem;
          color: #e2e8f0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .footer-col h4 {
          font-size: 1.05rem;
          color: #ffffff;
          margin-bottom: 1.2rem;
        }
        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          font-size: 0.88rem;
        }
        .footer-links a, .footer-links span {
          color: #cbd5e1;
          transition: color 0.2s ease;
        }
        .footer-links a:hover { color: #38bdf8; }
        .btn-link-admin {
          background: none;
          border: none;
          color: #fbbf24;
          font-weight: 700;
          cursor: pointer;
          font-size: 0.88rem;
          padding: 0;
          text-align: left;
        }
        .contact-col {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-size: 0.88rem;
          color: #cbd5e1;
        }
        .opd-pill-footer {
          background: rgba(2, 132, 199, 0.15);
          border: 1px solid rgba(2, 132, 199, 0.3);
          padding: 0.6rem 0.85rem;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
        }
        .opd-pill-footer strong { color: #ffffff; display: block; }
        .opd-pill-footer p { color: #38bdf8; }

        .footer-bottom {
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.82rem;
          color: #64748b;
        }

        @media (max-width: 992px) {
          .footer-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr; }
          .footer-bottom { flex-direction: column; text-align: center; gap: 0.5rem; }
        }
      `}</style>
    </footer>
  );
};
