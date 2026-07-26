import React from 'react';
import { EYE_CARE_SERVICES } from '../data/mockData';
import { Stethoscope, Clock, Calendar } from 'lucide-react';

export const EyeServices = ({ onBookClick }) => {
  return (
    <section id="services" className="services-section section-padding">
      <div className="container">
        
        <div className="section-title-wrap">
          <div className="badge badge-blue">
            <Stethoscope size={14} />
            <span>Clinical Services</span>
          </div>
          <h2>Comprehensive Eye Care & Diagnostic Services</h2>
          <p>State-of-the-art diagnostic technology for accurate vision assessment and early ocular disease intervention.</p>
        </div>

        <div className="services-grid">
          {EYE_CARE_SERVICES.map((srv) => (
            <div key={srv.id} className="service-card glass-card">
              <div className="service-header">
                <span className="service-price-pill">{srv.price}</span>
                <span className="service-time-pill">
                  <Clock size={13} /> {srv.duration}
                </span>
              </div>

              <h3 className="service-title">{srv.title}</h3>
              <p className="service-desc">{srv.description}</p>

              <button onClick={onBookClick} className="btn btn-secondary btn-sm service-btn">
                <Calendar size={14} /> Book Service Slot
              </button>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        .services-section {
          background: #f8fafc;
        }
        .services-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }
        .service-card {
          padding: 1.75rem;
          background: #ffffff;
          border: 1px solid var(--border-light);
          display: flex;
          flex-direction: column;
          transition: all 0.25s ease;
        }
        .service-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: var(--accent-blue);
        }
        .service-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }
        .service-price-pill {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.1rem;
          color: var(--primary-navy);
        }
        .service-time-pill {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-muted);
          background: #f1f5f9;
          padding: 0.25rem 0.55rem;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        .service-title {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--primary-navy);
          margin-bottom: 0.6rem;
        }
        .service-desc {
          font-size: 0.88rem;
          color: var(--text-muted);
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }
        .service-btn {
          margin-top: auto;
          width: 100%;
        }

        @media (max-width: 1024px) {
          .services-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .services-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
};
