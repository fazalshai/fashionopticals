import React, { useState } from 'react';
import { DOCTOR_INFO, TREATMENTS } from '../data/mockData';
import { Award, GraduationCap, Building2, CheckCircle2, Eye, Calendar, Sparkles } from 'lucide-react';
import doctorImg from '../assets/dr_vuyyuru_raja_sekhar.png';
import eyeExamImg from '../assets/eye_examination_clinic.jpg';

export const DoctorSection = ({ onBookClick }) => {
  const [selectedTreatment, setSelectedTreatment] = useState(null);

  return (
    <section id="doctor" className="doctor-section section-padding">
      <div className="container">
        
        <div className="section-title-wrap">
          <div className="badge badge-blue">
            <Eye size={14} />
            <span>Senior Ophthalmologist Profile</span>
          </div>
          <h2>Meet Dr. Vuyyuru Raja Sekhar</h2>
          <p>Over 38 years of dedicated clinical expertise in advanced ophthalmology and vision restoration surgery.</p>
        </div>

        <div className="doctor-profile-grid">
          {/* Left: Detailed Biography Card */}
          <div className="bio-card glass-card">
            <div className="bio-header">
              <div className="bio-avatar-wrap">
                <img src={doctorImg} alt={DOCTOR_INFO.name} className="bio-avatar" />
              </div>
              <div>
                <h3 className="bio-doctor-name">{DOCTOR_INFO.name}</h3>
                <p className="bio-doctor-title">{DOCTOR_INFO.title}</p>
                <div className="rating-pill">
                  <span>★ {DOCTOR_INFO.rating} Recommended</span>
                  <span className="rating-count">({DOCTOR_INFO.totalRatings} Ratings)</span>
                </div>
              </div>
            </div>

            {/* In-Clinic Examination Photo Showcase */}
            <div style={{ marginBottom: '1.5rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-light)', boxShadow: '0 4px 14px rgba(0,0,0,0.08)' }}>
              <img 
                src={eyeExamImg} 
                alt="Dr. Vuyyuru Raja Sekhar performing eye examination with computerized ARK refraction machine" 
                style={{ width: '100%', height: '230px', objectFit: 'cover', objectPosition: 'center 30%', display: 'block' }} 
              />
              <div style={{ padding: '10px 14px', background: '#f8fafc', fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary-navy)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>📷 Computerized ARK Eye Testing & Diagnostic Room</span>
                <span style={{ fontSize: '0.75rem', background: '#0284c7', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>Fashion Opticals Clinic</span>
              </div>
            </div>

            <p className="bio-text">
              {DOCTOR_INFO.bio}
            </p>

            <div className="qualifications-grid">
              <div className="qual-item">
                <GraduationCap className="qual-icon" size={20} />
                <div>
                  <strong>Education & Degrees</strong>
                  <p>MBBS (Nagarjuna Univ) | MS Ophthalmology</p>
                </div>
              </div>

              <div className="qual-item">
                <Building2 className="qual-icon" size={20} />
                <div>
                  <strong>Hospital Affiliation</strong>
                  <p>Guntur Medical College & Hospital</p>
                </div>
              </div>

              <div className="qual-item">
                <Award className="qual-icon" size={20} />
                <div>
                  <strong>Surgical Experience</strong>
                  <p>38+ Years Handling Complex Cases</p>
                </div>
              </div>
            </div>

            <div className="opd-box">
              <div className="opd-time">
                <Calendar size={18} className="opd-icon" />
                <div>
                  <strong>Consultation OPD Timings</strong>
                  <p>Monday to Saturday: 09:00 AM - 01:00 PM (Closed Sunday)</p>
                </div>
              </div>
              <button onClick={onBookClick} className="btn btn-primary btn-sm">
                Book Visit
              </button>
            </div>
          </div>

          {/* Right: Medical Specialities & Treatments Offered */}
          <div className="treatments-container">
            <h3 className="treatments-heading">
              Specialized Eye Treatments & Procedures
            </h3>
            <p className="treatments-subheading">
              Click any treatment procedure to view details and schedule a direct consultation.
            </p>

            <div className="treatments-grid">
              {TREATMENTS.map((item) => (
                <div 
                  key={item.id} 
                  className="treatment-card"
                  onClick={() => setSelectedTreatment(item)}
                >
                  <div className="treatment-badge">{item.category}</div>
                  <h4 className="treatment-title">{item.title}</h4>
                  <p className="treatment-desc">{item.description}</p>
                  <div className="treatment-link">
                    <span>Learn More & Consult</span>
                    <span>→</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick List of All Offered Treatments */}
            <div className="procedures-list-card">
              <h4 className="procedures-title">
                <Sparkles size={16} className="text-gold" />
                All Surgical & Diagnostic Procedures Offered
              </h4>
              <div className="procedures-tags">
                {[
                  "Phacoemulsification Cataract",
                  "Trabeculoplasty",
                  "Keratoplasty & Cornea Transplant",
                  "Vitrectomy",
                  "LASIK Laser Vision Correction",
                  "Pterygium Excision",
                  "Amblyopia Lazy Eye Therapy",
                  "Ptosis Eyelid Correction",
                  "Squint Realignment Surgery",
                  "Laser Iridotomy",
                  "Computer Vision Syndrome Evaluation"
                ].map((tag, idx) => (
                  <span key={idx} className="procedure-tag">
                    <CheckCircle2 size={13} className="check-icon" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Treatment Detail Modal */}
        {selectedTreatment && (
          <div className="modal-overlay" onClick={() => setSelectedTreatment(null)}>
            <div className="modal-content glass-card animate-fade-in" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <span className="badge badge-blue">{selectedTreatment.category}</span>
                <button className="modal-close" onClick={() => setSelectedTreatment(null)}>×</button>
              </div>
              <h3 className="modal-title">{selectedTreatment.title}</h3>
              <p className="modal-desc">{selectedTreatment.description}</p>
              
              <div className="modal-doctor-note">
                <strong>Doctor's Consultation Note:</strong>
                <p>Performed by Dr. Vuyyuru Raja Sekhar at our fully equipped eye clinic. Book a slot during 09:00 AM - 01:00 PM for thorough evaluation.</p>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelectedTreatment(null)}>Close</button>
                <button 
                  className="btn btn-gold" 
                  onClick={() => { setSelectedTreatment(null); onBookClick(); }}
                >
                  <Calendar size={16} />
                  Book Consultation for {selectedTreatment.title}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      <style>{`
        .doctor-section {
          background: #ffffff;
        }
        .doctor-profile-grid {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 2.5rem;
          align-items: start;
        }
        .bio-card {
          padding: 2rem;
          border: 1px solid var(--border-light);
        }
        .bio-header {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          margin-bottom: 1.5rem;
        }
        .bio-avatar {
          width: 110px;
          height: 110px;
          border-radius: 16px;
          object-fit: cover;
          object-position: center top;
          border: 3px solid var(--accent-blue);
          box-shadow: 0 4px 12px rgba(2, 132, 199, 0.2);
        }
        .bio-doctor-name {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--primary-navy);
        }
        .bio-doctor-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--accent-blue);
        }
        .rating-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #fef3c7;
          color: #b45309;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          margin-top: 0.35rem;
        }
        .rating-count {
          color: #78350f;
          font-weight: 500;
        }
        .bio-text {
          color: var(--text-muted);
          font-size: 0.98rem;
          line-height: 1.65;
          margin-bottom: 1.75rem;
        }
        .qualifications-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.75rem;
          background: #f8fafc;
          padding: 1.2rem;
          border-radius: var(--radius-md);
        }
        .qual-item {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
        }
        .qual-icon {
          color: var(--accent-blue);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .qual-item strong {
          font-size: 0.9rem;
          color: var(--primary-navy);
          display: block;
        }
        .qual-item p {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .opd-box {
          background: linear-gradient(135deg, #0b132b 0%, #1c2541 100%);
          color: #ffffff;
          padding: 1.25rem;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .opd-time {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .opd-icon { color: #38bdf8; flex-shrink: 0; }
        .opd-time strong { display: block; font-size: 0.9rem; }
        .opd-time p { font-size: 0.8rem; color: #94a3b8; }
        .btn-sm { padding: 0.5rem 1rem; font-size: 0.85rem; }

        /* Treatments Right Column */
        .treatments-heading {
          font-size: 1.5rem;
          margin-bottom: 0.4rem;
        }
        .treatments-subheading {
          color: var(--text-muted);
          font-size: 0.95rem;
          margin-bottom: 1.5rem;
        }
        .treatments-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .treatment-card {
          background: #ffffff;
          border: 1px solid var(--border-light);
          padding: 1.2rem;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .treatment-card:hover {
          border-color: var(--accent-blue);
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
        }
        .treatment-badge {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--accent-blue);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }
        .treatment-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--primary-navy);
          margin-bottom: 0.4rem;
        }
        .treatment-desc {
          font-size: 0.82rem;
          color: var(--text-muted);
          margin-bottom: 1rem;
          line-height: 1.5;
        }
        .treatment-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--accent-blue);
        }

        .procedures-list-card {
          background: #f8fafc;
          border: 1px solid var(--border-light);
          padding: 1.25rem;
          border-radius: var(--radius-md);
        }
        .procedures-title {
          font-size: 0.95rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.85rem;
        }
        .text-gold { color: var(--accent-gold); }
        .procedures-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .procedure-tag {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          padding: 0.35rem 0.65rem;
          border-radius: var(--radius-sm);
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-dark);
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .check-icon { color: #10b981; }

        /* Modal overlay */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(11, 19, 43, 0.7);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }
        .modal-content {
          background: #ffffff;
          max-width: 540px;
          width: 100%;
          padding: 2rem;
          border-radius: var(--radius-lg);
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .modal-close {
          background: none;
          border: none;
          font-size: 1.8rem;
          color: var(--text-muted);
          cursor: pointer;
          line-height: 1;
        }
        .modal-title { font-size: 1.5rem; margin-bottom: 0.75rem; }
        .modal-desc { color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem; }
        .modal-doctor-note {
          background: #f0f9ff;
          border-left: 4px solid var(--accent-blue);
          padding: 1rem;
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
          margin-bottom: 1.5rem;
        }
        .modal-doctor-note strong { color: var(--primary-navy); font-size: 0.9rem; }
        .modal-doctor-note p { font-size: 0.85rem; color: var(--text-dark); margin-top: 0.2rem; }
        .modal-footer { display: flex; justify-content: flex-end; gap: 0.85rem; }

        @media (max-width: 992px) {
          .doctor-profile-grid { grid-template-columns: 1fr; }
          .treatments-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
};
