import React, { useState, useEffect } from 'react';
import { DOCTOR_INFO } from '../data/mockData';
import { generateTimeSlots, isSlotBookedOrBlocked, saveAppointment } from '../utils/storage';
import { Calendar as CalendarIcon, Clock, User, Phone, Hash, CheckCircle2, AlertCircle, Printer, MessageSquare, PlusCircle } from 'lucide-react';

export const AppointmentBooking = ({ onBookingComplete }) => {
  // Step State: 1 = Form Details, 2 = Date & Slot, 3 = Confirmation Pass
  const [step, setStep] = useState(1);

  // Form State
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [reason, setReason] = useState('General Eye Checkup & Vision Testing');

  // Booking Date & Slot State
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  // Confirmation Result State
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Validation Error State
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-set tomorrow or next working day date on load
  useEffect(() => {
    const today = new Date();
    // Default to tomorrow
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);

    // If tomorrow is Sunday (0), move to Monday
    if (nextDay.getDay() === 0) {
      nextDay.setDate(nextDay.getDate() + 1);
    }

    const yyyy = nextDay.getFullYear();
    const mm = String(nextDay.getMonth() + 1).padStart(2, '0');
    const dd = String(nextDay.getDate()).padStart(2, '0');
    setSelectedDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  // Calculate day name for selected date
  const getSelectedDayName = (dateStr) => {
    if (!dateStr) return '';
    const dateObj = new Date(dateStr + 'T00:00:00');
    return dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isSunday = (dateStr) => {
    if (!dateStr) return false;
    const dateObj = new Date(dateStr + 'T00:00:00');
    return dateObj.getDay() === 0; // 0 = Sunday
  };

  const isPastDate = (dateStr) => {
    if (!dateStr) return false;
    const todayStr = new Date().toISOString().split('T')[0];
    return dateStr < todayStr;
  };

  // Handle Step 1 -> Step 2
  const handleProceedToSlots = (e) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setErrorMsg('Please enter patient full name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!age || Number(age) <= 0 || Number(age) > 120) {
      setErrorMsg('Please enter a valid patient age.');
      return;
    }

    setErrorMsg('');
    setStep(2);
  };

  // Handle Booking Submit
  const handleConfirmBooking = () => {
    if (!selectedDate) {
      setErrorMsg('Please select an appointment date.');
      return;
    }
    if (isSunday(selectedDate)) {
      setErrorMsg('Clinic is closed on Sundays. Please select Monday to Saturday.');
      return;
    }
    if (isPastDate(selectedDate)) {
      setErrorMsg('Cannot book appointments for past dates.');
      return;
    }
    if (!selectedTimeSlot) {
      setErrorMsg('Please select an available 9 AM - 1 PM time slot.');
      return;
    }

    // Double check availability
    const { isBooked, isBlocked } = isSlotBookedOrBlocked(selectedDate, selectedTimeSlot);
    if (isBooked || isBlocked) {
      setErrorMsg('Selected slot was just reserved by another patient. Please pick another time slot.');
      return;
    }

    const bookingPayload = {
      patientName: patientName.trim(),
      phone: phone.startsWith('+91') ? phone : `+91 ${phone.trim()}`,
      age: Number(age),
      gender,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      reason: reason.trim() || 'General Eye Checkup',
      doctorName: DOCTOR_INFO.name,
      doctorAffil: DOCTOR_INFO.affiliation
    };

    const saved = saveAppointment(bookingPayload);
    setConfirmedBooking(saved);
    setStep(3);
    setErrorMsg('');
    if (onBookingComplete) onBookingComplete(saved);
  };

  const handleReset = () => {
    setPatientName('');
    setPhone('');
    setAge('');
    setSelectedTimeSlot('');
    setConfirmedBooking(null);
    setStep(1);
  };

  // Print Pass
  const handlePrint = () => {
    window.print();
  };

  const allTimeSlots = generateTimeSlots(); // 09:00 AM to 12:45 PM

  return (
    <section id="book-appointment" className="booking-section section-padding">
      <div className="container">
        
        <div className="section-title-wrap">
          <div className="badge badge-gold">
            <CalendarIcon size={14} />
            <span>Online Doctor Appointment System</span>
          </div>
          <h2>Book Consultation with Dr. Vuyyuru Raja Sekhar</h2>
          <p>Instant confirmation • Mon-Sat 09:00 AM - 01:00 PM • Zero waiting time guaranteed</p>
        </div>

        <div className="booking-wrapper glass-card">
          
          {/* Step Progress Bar */}
          <div className="booking-steps-nav">
            <div className={`step-pill ${step >= 1 ? 'active' : ''}`}>
              <span className="step-num">1</span>
              <span>Patient Details</span>
            </div>
            <div className="step-line"></div>
            <div className={`step-pill ${step >= 2 ? 'active' : ''}`}>
              <span className="step-num">2</span>
              <span>Date & Time Slot</span>
            </div>
            <div className="step-line"></div>
            <div className={`step-pill ${step === 3 ? 'active' : ''}`}>
              <span className="step-num">3</span>
              <span>Appointment Pass</span>
            </div>
          </div>

          {errorMsg && (
            <div className="booking-error-banner animate-fade-in">
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: PATIENT DETAILS */}
          {step === 1 && (
            <form onSubmit={handleProceedToSlots} className="booking-form animate-fade-in">
              <h3 className="form-step-title">Step 1: Patient Contact & Profile</h3>
              
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="patientName">
                    <User size={15} /> Patient Full Name *
                  </label>
                  <input
                    id="patientName"
                    type="text"
                    className="form-control"
                    placeholder="e.g. Ramesh Kumar"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">
                    <Phone size={15} /> Mobile Phone Number *
                  </label>
                  <div className="phone-input-wrap">
                    <span className="phone-prefix">+91</span>
                    <input
                      id="phone"
                      type="tel"
                      className="form-control phone-input"
                      placeholder="98480 12345"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="age">
                    <Hash size={15} /> Patient Age (Years) *
                  </label>
                  <input
                    id="age"
                    type="number"
                    className="form-control"
                    placeholder="e.g. 45"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min={1}
                    max={120}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="gender">Gender</label>
                  <select
                    id="gender"
                    className="form-control"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reason">Reason for Visit / Main Complaints (Optional)</label>
                <textarea
                  id="reason"
                  className="form-control"
                  rows={3}
                  placeholder="e.g. Eye pain, Cataract checkup, Blurred vision, Spectacle power test..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <div className="form-actions right">
                <button type="submit" className="btn btn-primary btn-lg">
                  Next: Select Date & Available Time Slot →
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: DATE & SLOT SELECTION */}
          {step === 2 && (
            <div className="booking-slot-selection animate-fade-in">
              <div className="step-header">
                <div>
                  <h3 className="form-step-title">Step 2: Choose Consultation Date & Slot</h3>
                  <p className="form-step-sub">OPD Hours: Monday – Saturday (09:00 AM to 01:00 PM). Clinic Closed on Sundays.</p>
                </div>
                <button onClick={() => setStep(1)} className="btn btn-secondary btn-sm">
                  ← Back to Patient Info
                </button>
              </div>

              {/* Date Input */}
              <div className="date-picker-row">
                <div className="form-group date-input-group">
                  <label htmlFor="appointmentDate">
                    <CalendarIcon size={16} /> Select Consultation Date
                  </label>
                  <input
                    id="appointmentDate"
                    type="date"
                    className="form-control date-control"
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedTimeSlot('');
                    }}
                  />
                </div>

                <div className="selected-date-info">
                  {selectedDate && (
                    <div className={`date-badge-wrap ${isSunday(selectedDate) ? 'closed' : 'open'}`}>
                      <span className="date-display-name">{getSelectedDayName(selectedDate)}</span>
                      {isSunday(selectedDate) ? (
                        <span className="status-tag closed">✕ Sunday (Clinic Closed)</span>
                      ) : (
                        <span className="status-tag open">✓ Doctor OPD Available (9 AM - 1 PM)</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Time Slot Picker */}
              {selectedDate && isSunday(selectedDate) ? (
                <div className="sunday-closed-box">
                  <AlertCircle size={32} className="closed-icon" />
                  <h4>Doctor OPD is Closed on Sundays</h4>
                  <p>Dr. Vuyyuru Raja Sekhar conducts consultations Monday through Saturday from 9:00 AM to 1:00 PM. Please select another date.</p>
                </div>
              ) : (
                <div className="slots-grid-container">
                  <h4 className="slots-title">
                    <Clock size={16} /> Available 15-Minute Consultation Slots
                  </h4>
                  <p className="slots-hint">Select your preferred time slot below:</p>

                  <div className="slots-grid">
                    {allTimeSlots.map((slot) => {
                      const { isBooked, isBlocked } = isSlotBookedOrBlocked(selectedDate, slot);
                      const isSelected = selectedTimeSlot === slot;
                      const isUnavailable = isBooked || isBlocked;

                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isUnavailable}
                          className={`slot-btn ${isSelected ? 'selected' : ''} ${isBooked ? 'booked' : ''} ${isBlocked ? 'blocked' : ''}`}
                          onClick={() => {
                            setSelectedTimeSlot(slot);
                            setErrorMsg('');
                          }}
                        >
                          <span className="slot-time">{slot}</span>
                          <span className="slot-status">
                            {isBooked ? "BOOKED" : isBlocked ? "UNAVAILABLE" : isSelected ? "SELECTED" : "AVAILABLE"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2 Actions */}
              <div className="booking-summary-bar">
                <div className="summary-details">
                  {selectedTimeSlot ? (
                    <div>
                      <strong className="text-navy">Selected Slot:</strong> {getSelectedDayName(selectedDate)} at <strong>{selectedTimeSlot}</strong>
                    </div>
                  ) : (
                    <span className="text-muted">Please select an available slot to complete booking.</span>
                  )}
                </div>
                <button
                  type="button"
                  disabled={!selectedTimeSlot || isSunday(selectedDate)}
                  onClick={handleConfirmBooking}
                  className="btn btn-gold btn-lg pulse-glow"
                >
                  Confirm Appointment Pass →
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: CONFIRMATION TICKET / PASS */}
          {step === 3 && confirmedBooking && (
            <div className="booking-confirmation animate-fade-in printable-ticket">
              <div className="ticket-header">
                <div className="success-icon-wrap">
                  <CheckCircle2 size={40} />
                </div>
                <h2>Appointment Confirmed!</h2>
                <p>Your consultation pass has been generated. Please arrive 10 minutes before your time slot.</p>
              </div>

              <div className="ticket-card glass-card">
                <div className="ticket-top">
                  <div className="ticket-brand">
                    <span className="ticket-clinic">FASHION OPTICALS & EYE CLINIC</span>
                    <span className="ticket-doctor">{DOCTOR_INFO.name} ({DOCTOR_INFO.qualifications})</span>
                  </div>
                  <div className="ticket-id-badge">
                    <span className="id-lbl">APPOINTMENT ID</span>
                    <span className="id-val">{confirmedBooking.id}</span>
                  </div>
                </div>

                <div className="ticket-divider"></div>

                <div className="ticket-details-grid">
                  <div className="detail-box">
                    <span className="detail-lbl">Patient Name</span>
                    <strong className="detail-val">{confirmedBooking.patientName} ({confirmedBooking.age} Yrs, {confirmedBooking.gender})</strong>
                  </div>

                  <div className="detail-box">
                    <span className="detail-lbl">Contact Phone</span>
                    <strong className="detail-val">{confirmedBooking.phone}</strong>
                  </div>

                  <div className="detail-box highlight">
                    <span className="detail-lbl">Appointment Date</span>
                    <strong className="detail-val text-blue">{getSelectedDayName(confirmedBooking.date)}</strong>
                  </div>

                  <div className="detail-box highlight">
                    <span className="detail-lbl">Consultation Time Slot</span>
                    <strong className="detail-val text-gold">{confirmedBooking.timeSlot}</strong>
                  </div>

                  <div className="detail-box">
                    <span className="detail-lbl">Clinic OPD Address</span>
                    <span className="detail-val">Guntur Medical College Rd & Vaddeswaram Clinic</span>
                  </div>

                  <div className="detail-box">
                    <span className="detail-lbl">Consultation Fee</span>
                    <strong className="detail-val">{DOCTOR_INFO.consultationFee} (Pay at Clinic Desk)</strong>
                  </div>
                </div>

                <div className="ticket-instructions">
                  <strong>Important Instructions for Patient:</strong>
                  <ul>
                    <li>Please bring your previous eye checkup records or spectacle prescriptions if available.</li>
                    <li>If dilating drops are required, driving may be temporarily restricted for 2 hours.</li>
                    <li>For changes or cancellations, call clinic desk at +91 8512830995.</li>
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="ticket-actions no-print">
                <button onClick={handlePrint} className="btn btn-secondary">
                  <Printer size={16} /> Print Appointment Pass
                </button>

                <a 
                  href={`https://wa.me/918512830995?text=Hello%20Dr.%20Vuyyuru%20Raja%20Sekhar%20Clinic,%20my%20appointment%20id%20is%20${confirmedBooking.id}%20for%20${confirmedBooking.patientName}%20on%20${confirmedBooking.date}%20at%20${confirmedBooking.timeSlot}.`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary"
                  style={{ background: '#16a34a' }}
                >
                  <MessageSquare size={16} /> Send WhatsApp Reminder
                </a>

                <button onClick={handleReset} className="btn btn-gold">
                  <PlusCircle size={16} /> Book Another Appointment
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

      <style>{`
        .booking-section {
          background: #f8fafc;
        }
        .booking-wrapper {
          max-width: 900px;
          margin: 0 auto;
          padding: 2.5rem;
          background: #ffffff;
          border: 1px solid var(--border-light);
        }
        .booking-steps-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-light);
        }
        .step-pill {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--text-muted);
        }
        .step-num {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #e2e8f0;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
        }
        .step-pill.active {
          color: var(--primary-navy);
        }
        .step-pill.active .step-num {
          background: var(--accent-blue);
          color: #ffffff;
          box-shadow: 0 0 10px rgba(2, 132, 199, 0.4);
        }
        .step-line {
          flex: 1;
          height: 2px;
          background: #e2e8f0;
          margin: 0 1rem;
        }

        .booking-error-banner {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 0.85rem 1.2rem;
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 1.5rem;
        }

        .form-step-title {
          font-size: 1.3rem;
          margin-bottom: 0.4rem;
        }
        .form-step-sub {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }
        .phone-input-wrap {
          display: flex;
          align-items: center;
        }
        .phone-prefix {
          background: #f1f5f9;
          border: 1.5px solid var(--border-light);
          border-right: none;
          padding: 0.85rem 0.75rem;
          border-radius: var(--radius-sm) 0 0 var(--radius-sm);
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--primary-navy);
        }
        .phone-input {
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
        }
        .form-actions {
          margin-top: 1.5rem;
          display: flex;
        }
        .form-actions.right {
          justify-content: flex-end;
        }

        /* Step 2 Slots */
        .step-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }
        .date-picker-row {
          display: flex;
          align-items: flex-end;
          gap: 1.5rem;
          background: #f8fafc;
          padding: 1.25rem;
          border-radius: var(--radius-md);
          margin-bottom: 1.75rem;
        }
        .date-input-group {
          margin-bottom: 0;
          flex: 1;
        }
        .date-control {
          font-weight: 700;
          font-size: 1.05rem;
        }
        .selected-date-info {
          flex: 1.2;
        }
        .date-display-name {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--primary-navy);
          display: block;
          margin-bottom: 0.2rem;
        }
        .status-tag {
          font-size: 0.82rem;
          font-weight: 700;
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-sm);
          display: inline-block;
        }
        .status-tag.open { background: #dcfce7; color: #15803d; }
        .status-tag.closed { background: #fee2e2; color: #b91c1c; }

        .sunday-closed-box {
          text-align: center;
          padding: 3rem 1.5rem;
          background: #fff1f2;
          border: 1px dashed #fda4af;
          border-radius: var(--radius-lg);
          margin-bottom: 2rem;
        }
        .closed-icon { color: #e11d48; margin-bottom: 0.85rem; }
        .sunday-closed-box h4 { font-size: 1.3rem; color: #9f1239; margin-bottom: 0.4rem; }
        .sunday-closed-box p { color: #be123c; font-size: 0.95rem; max-width: 500px; margin: 0 auto; }

        .slots-title {
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-bottom: 0.2rem;
        }
        .slots-hint {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 1.25rem;
        }
        .slots-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.85rem;
          margin-bottom: 2rem;
        }
        .slot-btn {
          background: #ffffff;
          border: 1.5px solid var(--border-light);
          padding: 0.75rem 0.5rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: all 0.2s ease;
        }
        .slot-btn:hover:not(:disabled) {
          border-color: var(--accent-blue);
          background: #f0f9ff;
          transform: translateY(-2px);
        }
        .slot-btn.selected {
          background: var(--primary-navy);
          border-color: var(--primary-navy);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(11, 19, 43, 0.3);
        }
        .slot-btn.selected .slot-status { color: #38bdf8; }
        .slot-btn.booked {
          background: #f1f5f9;
          border-color: #e2e8f0;
          cursor: not-allowed;
          opacity: 0.6;
        }
        .slot-btn.blocked {
          background: #fef2f2;
          border-color: #fee2e2;
          cursor: not-allowed;
          opacity: 0.6;
        }
        .slot-time {
          font-size: 0.95rem;
          font-weight: 800;
        }
        .slot-status {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          margin-top: 0.2rem;
          color: var(--text-muted);
        }
        .slot-btn.booked .slot-status { color: #ef4444; }

        .booking-summary-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border-light);
        }
        .summary-details {
          font-size: 0.95rem;
        }
        .text-navy { color: var(--primary-navy); }
        .text-blue { color: var(--accent-blue); }
        .text-gold { color: var(--accent-gold); }

        /* Step 3 Confirmation Ticket */
        .ticket-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .success-icon-wrap {
          color: #10b981;
          margin-bottom: 0.75rem;
        }
        .ticket-card {
          padding: 2rem;
          border: 2px solid var(--accent-blue);
          margin-bottom: 2rem;
          background: #ffffff;
        }
        .ticket-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .ticket-clinic {
          display: block;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: var(--accent-blue);
        }
        .ticket-doctor {
          display: block;
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--primary-navy);
        }
        .ticket-id-badge {
          text-align: right;
          background: #f0f9ff;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-sm);
          border: 1px solid #bae6fd;
        }
        .id-lbl { display: block; font-size: 0.65rem; font-weight: 700; color: #0369a1; }
        .id-val { display: block; font-size: 1rem; font-weight: 800; color: var(--primary-navy); }

        .ticket-divider {
          height: 1px;
          background: var(--border-light);
          margin: 1.5rem 0;
        }
        .ticket-details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.2rem;
          margin-bottom: 1.5rem;
        }
        .detail-box {
          background: #f8fafc;
          padding: 0.85rem 1rem;
          border-radius: var(--radius-sm);
        }
        .detail-box.highlight {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
        }
        .detail-lbl {
          display: block;
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.2rem;
        }
        .detail-val {
          font-size: 0.95rem;
          font-weight: 700;
        }

        .ticket-instructions {
          background: #fffbeb;
          border-left: 4px solid #f59e0b;
          padding: 1rem;
          font-size: 0.82rem;
        }
        .ticket-instructions strong { color: #92400e; display: block; margin-bottom: 0.3rem; }
        .ticket-instructions ul { padding-left: 1.2rem; color: #78350f; }
        .ticket-instructions li { margin-bottom: 0.2rem; }

        .ticket-actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        @media print {
          .no-print, .header-nav, footer { display: none !important; }
          .booking-section { padding: 0; background: none; }
          .booking-wrapper { border: none; box-shadow: none; }
        }

        @media (max-width: 768px) {
          .form-grid { grid-template-columns: 1fr; }
          .slots-grid { grid-template-columns: repeat(2, 1fr); }
          .date-picker-row { flex-direction: column; align-items: stretch; }
          .ticket-details-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
};
