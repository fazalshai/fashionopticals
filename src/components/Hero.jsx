import React from 'react';
import { Calendar, Phone, Award, ShieldCheck, Sparkles, Star, MapPin, Clock } from 'lucide-react';
import { DOCTOR_INFO } from '../data/mockData';

export const Hero = ({ onBookClick, onExploreOpticals }) => {
  return (
    <section id="home" className="hero-section">
      <div className="hero-backdrop"></div>
      <div className="container hero-container">
        
        {/* Left Hero Content */}
        <div className="hero-content">
          <div className="badge badge-gold hero-top-badge animate-fade-in">
            <Sparkles size={14} />
            <span>Complete Eye Care Clinic & Fashion Opticals</span>
          </div>

          <h1 className="hero-title animate-fade-in">
            Expert Eye Care. <br />
            <span className="gradient-text">Clearer Vision for Life.</span>
          </h1>

          <p className="hero-subtitle animate-fade-in">
            Consult renowned Ophthalmologist <strong>Dr. Vuyyuru Raja Sekhar</strong> (38+ Years Experience) for comprehensive eye diagnosis, cataract, glaucoma & cornea treatments, paired with premium fashion eyewear.
          </p>

          {/* Quick CTA Buttons */}
          <div className="hero-actions animate-fade-in">
            <button onClick={onBookClick} className="btn btn-gold btn-lg pulse-glow">
              <Calendar size={18} />
              Book Doctor Appointment
            </button>
            
            <button onClick={onExploreOpticals} className="btn btn-secondary btn-lg">
              Explore Eyewear Store
            </button>
          </div>

          {/* Key Quick Badges */}
          <div className="hero-stats-grid">
            <div className="stat-card">
              <div className="stat-icon-wrap blue">
                <Award size={20} />
              </div>
              <div>
                <div className="stat-number">38+ Years</div>
                <div className="stat-label">Surgical Experience</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrap gold">
                <Star size={20} />
              </div>
              <div>
                <div className="stat-number">97%</div>
                <div className="stat-label">Patient Recommended</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrap cyan">
                <Clock size={20} />
              </div>
              <div>
                <div className="stat-number">9 AM – 1 PM</div>
                <div className="stat-label">OPD Mon - Sat</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Doctor Spotlight Card */}
        <div className="hero-doctor-card-wrap animate-fade-in">
          <div className="doctor-hero-card glass-card">
            <div className="doctor-image-container">
              <img 
                src="/doctor.png?v=3" 
                alt="Dr. Vuyyuru Raja Sekhar" 
                className="doctor-hero-img" 
              />
              <div className="doctor-experience-tag">
                <ShieldCheck size={16} />
                <span>38+ Yrs Exp</span>
              </div>
            </div>

            <div className="doctor-card-body">
              <div className="doctor-verified-badge">
                <span className="dot-active"></span>
                <span>Available Today • OPD 9:00 AM - 1:00 PM</span>
              </div>
              <h3 className="doctor-name">{DOCTOR_INFO.name}</h3>
              <p className="doctor-qual">{DOCTOR_INFO.qualifications}</p>
              <p className="doctor-affil">{DOCTOR_INFO.affiliation}</p>

              <div className="doctor-card-footer">
                <div className="location-tag">
                  <MapPin size={14} />
                  <span>Kanna Vari Thota & Vaddeswaram</span>
                </div>
                <button onClick={onBookClick} className="btn-sm-book">
                  Book Visit →
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .hero-section {
          position: relative;
          background: linear-gradient(135deg, #0b132b 0%, #1c2541 60%, #0f172a 100%);
          color: #ffffff;
          padding: 4rem 0 5rem 0;
          overflow: hidden;
        }
        .hero-backdrop {
          position: absolute;
          top: -20%;
          right: -10%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(2, 132, 199, 0.15) 0%, rgba(217, 119, 6, 0.08) 50%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }
        .hero-container {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 3.5rem;
          align-items: center;
          position: relative;
          z-index: 1;
        }
        .hero-top-badge {
          margin-bottom: 1.2rem;
        }
        .hero-title {
          font-size: 3rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.03em;
          margin-bottom: 1.2rem;
          line-height: 1.15;
        }
        .gradient-text {
          background: linear-gradient(135deg, #38bdf8 0%, #fbbf24 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-subtitle {
          font-size: 1.1rem;
          color: #cbd5e1;
          margin-bottom: 2.2rem;
          max-width: 620px;
          line-height: 1.6;
        }
        .hero-actions {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }
        .btn-lg {
          padding: 0.95rem 2rem;
          font-size: 1.05rem;
          border-radius: var(--radius-md);
        }
        .hero-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.2rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .stat-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .stat-icon-wrap {
          width: 42px;
          height: 42px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .stat-icon-wrap.blue { background: rgba(2, 132, 199, 0.2); color: #38bdf8; }
        .stat-icon-wrap.gold { background: rgba(217, 119, 6, 0.2); color: #fbbf24; }
        .stat-icon-wrap.cyan { background: rgba(6, 182, 212, 0.2); color: #22d3ee; }
        
        .stat-number {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 700;
          color: #ffffff;
        }
        .stat-label {
          font-size: 0.78rem;
          color: #94a3b8;
        }

        /* Doctor Hero Card */
        .doctor-hero-card {
          background: rgba(255, 255, 255, 0.95);
          color: var(--text-dark);
          padding: 1.25rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.4);
        }
        .doctor-image-container {
          position: relative;
          border-radius: var(--radius-md);
          overflow: hidden;
          height: 380px;
          background: #e2e8f0;
        }
        .doctor-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 20%;
        }
        .doctor-experience-tag {
          position: absolute;
          top: 12px;
          right: 12px;
          background: var(--primary-navy);
          color: #ffffff;
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        }
        .doctor-card-body {
          padding-top: 1.2rem;
        }
        .doctor-verified-badge {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.78rem;
          color: #10b981;
          font-weight: 600;
          margin-bottom: 0.4rem;
        }
        .dot-active {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          box-shadow: 0 0 8px #10b981;
        }
        .doctor-name {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--primary-navy);
          margin-bottom: 0.2rem;
        }
        .doctor-qual {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--accent-blue);
        }
        .doctor-affil {
          font-size: 0.82rem;
          color: var(--text-muted);
          margin-bottom: 1rem;
        }
        .doctor-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.8rem;
          border-top: 1px solid var(--border-light);
        }
        .location-tag {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .btn-sm-book {
          background: var(--primary-navy);
          color: #ffffff;
          border: none;
          padding: 0.45rem 0.85rem;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .btn-sm-book:hover {
          background: var(--accent-blue);
        }

        @media (max-width: 992px) {
          .hero-container {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .hero-subtitle { margin: 0 auto 2rem auto; }
          .hero-actions { justify-content: center; }
          .hero-stats-grid { grid-template-columns: 1fr; gap: 1rem; }
          .doctor-hero-card { max-width: 420px; margin: 0 auto; }
        }
      `}</style>
    </section>
  );
};
