import React, { useState } from 'react';
import { DOCTOR_INFO } from '../data/mockData';
import { MapPin, Phone, MessageSquare, Clock, Send, CheckCircle2 } from 'lucide-react';

export const ContactLocation = () => {
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setInquiryName('');
      setInquiryPhone('');
      setInquiryMsg('');
    }, 4000);
  };

  return (
    <section id="contact" className="contact-section section-padding">
      <div className="container">
        
        <div className="section-title-wrap">
          <div className="badge badge-gold">
            <MapPin size={14} />
            <span>Clinic & Optical Store Location</span>
          </div>
          <h2>Visit Fashion Opticals & Dr. Sekhar's Eye Clinic</h2>
          <p>We are conveniently located with ample parking and wheelchair access for eye patients.</p>
        </div>

        <div className="contact-grid">
          
          {/* Left Column: Location & Hours Cards */}
          <div className="contact-info-col">
            
            <div className="info-card glass-card">
              <div className="info-card-header">
                <div className="icon-badge navy">
                  <MapPin size={22} />
                </div>
                <div>
                  <h3>Clinic & Store Address</h3>
                  <p>Fashion Opticals & Dr. Vuyyuru Raja Sekhar Eye Clinic</p>
                </div>
              </div>
              <p className="address-text">
                Opposite Karnataka Bank, Amaravathi Road,<br />
                Guntur, Andhra Pradesh.
              </p>
              <div className="card-actions">
                <a 
                  href="https://maps.google.com/?q=Guntur+Medical+College" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                >
                  Get Directions on Maps ↗
                </a>
              </div>
            </div>

            <div className="info-card glass-card">
              <div className="info-card-header">
                <div className="icon-badge blue">
                  <Clock size={22} />
                </div>
                <div>
                  <h3>OPD & Store Operating Hours</h3>
                  <p>Scheduled Doctor Consultations & Frame Sales</p>
                </div>
              </div>

              <div className="hours-table">
                <div className="hours-row highlight">
                  <span>Monday – Saturday (Doctor OPD):</span>
                  <strong>09:00 AM – 01:00 PM</strong>
                </div>
                <div className="hours-row">
                  <span>Monday – Saturday (Optical Store):</span>
                  <strong>09:00 AM – 08:00 PM</strong>
                </div>
                <div className="hours-row closed">
                  <span>Sunday (Clinic & Doctor):</span>
                  <strong className="text-red">Closed</strong>
                </div>
              </div>
            </div>

            <div className="info-card glass-card dark-glass">
              <h3>Emergency & Quick Helpline</h3>
              <p className="mb-3">Speak directly with our clinic desk or optical showroom staff:</p>
              <div className="phone-actions">
                <a href={`tel:${DOCTOR_INFO.phone}`} className="btn btn-gold btn-lg w-full">
                  <Phone size={18} /> Call Clinic Desk ({DOCTOR_INFO.phone})
                </a>
                <a 
                  href={`https://wa.me/${DOCTOR_INFO.whatsapp.replace(/\+/g, '')}?text=Hello%20Fashion%20Opticals,%20I%20have%20an%20inquiry.`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary btn-lg w-full"
                  style={{ background: '#16a34a' }}
                >
                  <MessageSquare size={18} /> WhatsApp Chat Assistant
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Inquiry Form & Interactive Map */}
          <div className="contact-form-col">
            <div className="form-card glass-card">
              <h3>Send Quick Query to Desk</h3>
              <p className="form-sub">Have a question regarding lens pricing, doctor availability, or insurance?</p>

              {submitted ? (
                <div className="submitted-success animate-fade-in">
                  <CheckCircle2 size={44} className="text-green" />
                  <h4>Message Received!</h4>
                  <p>Our clinic desk staff will call or WhatsApp you shortly back at {inquiryPhone}.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="inquiry-form">
                  <div className="form-group">
                    <label>Your Name *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Anand Sharma"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>Mobile Number *</label>
                    <input 
                      type="tel" 
                      className="form-control" 
                      placeholder="+91 98480 12345"
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>Your Query / Message *</label>
                    <textarea 
                      className="form-control" 
                      rows={4} 
                      placeholder="Ask about spectacle power test, surgery fees, or appointment slots..."
                      value={inquiryMsg}
                      onChange={(e) => setInquiryMsg(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg w-full">
                    <Send size={16} /> Send Message to Clinic Desk
                  </button>
                </form>
              )}
            </div>

            {/* Map Frame Embed Simulation */}
            <div className="map-frame-card glass-card">
              <iframe 
                title="Fashion Opticals Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15310.870341772648!2d80.435!3d16.30!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDE4JzAwLjAiTiA4MMKwMjYnMDAuMCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
                width="100%" 
                height="220" 
                style={{ border: 0, borderRadius: 'var(--radius-md)' }} 
                allowFullScreen="" 
                loading="lazy"
              />
            </div>

          </div>

        </div>

      </div>

      <style>{`
        .contact-section {
          background: #ffffff;
        }
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.5rem;
          align-items: start;
        }
        .contact-info-col {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .info-card {
          padding: 1.75rem;
          border: 1px solid var(--border-light);
        }
        .info-card-header {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .icon-badge {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .icon-badge.navy { background: rgba(11, 19, 43, 0.1); color: var(--primary-navy); }
        .icon-badge.blue { background: rgba(2, 132, 199, 0.1); color: var(--accent-blue); }

        .address-text {
          color: var(--text-muted);
          font-size: 0.95rem;
          margin-bottom: 1.2rem;
          line-height: 1.6;
        }
        .hours-table {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          background: #f8fafc;
          padding: 1rem;
          border-radius: var(--radius-md);
        }
        .hours-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.9rem;
        }
        .hours-row.highlight {
          color: var(--primary-navy);
          font-weight: 700;
        }
        .text-red { color: #dc2626; }
        .phone-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .mb-3 { margin-bottom: 1rem; }

        .form-card {
          padding: 2rem;
          border: 1px solid var(--border-light);
          margin-bottom: 1.5rem;
        }
        .form-card h3 { font-size: 1.3rem; margin-bottom: 0.3rem; }
        .form-sub { color: var(--text-muted); font-size: 0.88rem; margin-bottom: 1.5rem; }
        .submitted-success {
          text-align: center;
          padding: 2.5rem 1rem;
        }
        .text-green { color: #10b981; margin-bottom: 0.75rem; }
        .submitted-success h4 { font-size: 1.3rem; margin-bottom: 0.4rem; }
        .submitted-success p { color: var(--text-muted); font-size: 0.9rem; }

        @media (max-width: 992px) {
          .contact-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
};
