import React, { useState, useEffect } from 'react';
import { DOCTOR_INFO, SPECIAL_TIER_OFFERS, OPTICAL_PRODUCTS, TREATMENTS } from './data/mockData';
import { 
  getAppointments, 
  fetchAppointmentsFromBackend,
  saveAppointment, 
  updateAppointmentStatus, 
  deleteAppointment,
  getBlockedSlots, 
  toggleBlockSlot, 
  generateTimeSlots 
} from './utils/storage';
import { Phone, PlusCircle, Menu, X, MapPin, Download, Trash2, Database, ExternalLink, Calendar, RefreshCw } from 'lucide-react';
import doctorImg from './assets/dr_vuyyuru_raja_sekhar.png';
import eyeExamImg from './assets/eye_examination_clinic.jpg';

export default function App() {
  // Navigation & View State
  const [isAdminView, setIsAdminView] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [reservedSpectacle, setReservedSpectacle] = useState(null);

  // ---------- BOOKING SYSTEM STATE ----------
  const [bookingStep, setBookingStep] = useState(1); // 1 = Date/Time, 2 = Details, 3 = Confirmation

  // Calendar State
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth());
  const [calYear, setCalYear] = useState(() => new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // Form Details State
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [visitedBefore, setVisitedBefore] = useState('no'); // 'no' = first visit, 'yes' = returning
  const [reason, setReason] = useState('');

  // Confirmation Pass State
  const [confirmedTicket, setConfirmedTicket] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Listen for #admin URL hash or Ctrl+Shift+A keyboard shortcut for staff access
  useEffect(() => {
    const handleHashCheck = () => {
      if (window.location.hash === '#admin' || window.location.pathname === '/admin' || window.location.pathname === '/admin/') {
        setShowAdminLoginModal(true);
      }
    };
    handleHashCheck();
    window.addEventListener('hashchange', handleHashCheck);

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setShowAdminLoginModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', handleHashCheck);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Scroll helper
  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Helper date functions
  const pad = (n) => n.toString().padStart(2, '0');
  const dateKey = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
  
  const isPast = (y, m, d) => {
    const today = new Date(); 
    today.setHours(0, 0, 0, 0);
    return new Date(y, m, d) < today;
  };
  
  const isSunday = (y, m, d) => new Date(y, m, d).getDay() === 0;

  const isSlotPassedStr = (dateStr, sessionStr) => {
    if (!dateStr) return false;
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

    // Past date
    if (dateStr < todayStr) return true;
    // Future date
    if (dateStr > todayStr) return false;

    // Today's date: check current time vs OPD session end time
    const currentMins = now.getHours() * 60 + now.getMinutes();

    // Morning Session (09:00 AM - 10:30 AM) -> End time 10:30 AM (630 mins)
    if (sessionStr.includes('09:00 AM')) {
      return currentMins >= (10 * 60 + 30);
    }
    // Mid-Morning Session (10:30 AM - 12:00 PM) -> End time 12:00 PM (720 mins)
    if (sessionStr.includes('10:30 AM')) {
      return currentMins >= (12 * 60);
    }
    // Noon Session (12:00 PM - 01:00 PM) -> End time 01:00 PM (780 mins / 13:00)
    if (sessionStr.includes('12:00 PM') || sessionStr.includes('01:00 PM')) {
      return currentMins >= (13 * 60);
    }
    return false;
  };

  // Auto-default date on load to next available working day if today's OPD has ended
  useEffect(() => {
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    let target = new Date();
    // If today is Sunday or past OPD end time (1:00 PM / 13:00), default to tomorrow/next working day
    if (now.getDay() === 0 || currentMins >= (13 * 60)) {
      target.setDate(target.getDate() + 1);
    }
    if (target.getDay() === 0) {
      target.setDate(target.getDate() + 1);
    }

    const y = target.getFullYear();
    const m = target.getMonth();
    const d = target.getDate();
    setCalYear(y);
    setCalMonth(m);
    setSelectedDate(`${y}-${pad(m + 1)}-${pad(d)}`);
  }, []);

  const ALL_SESSIONS = generateTimeSlots(); // Session Windows

  // Handle Admin Login Attempt
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminUsername === 'admin' && adminPassword === 'admin') {
      setIsAdminView(true);
      setShowAdminLoginModal(false);
      setLoginError('');
      setAdminUsername('');
      setAdminPassword('');
    } else {
      setLoginError('Invalid Username or Password! (Hint: admin / admin)');
    }
  };

  // Calendar Days
  const getCalendarDays = () => {
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const leadBlanks = (firstDay + 6) % 7; // Monday start
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < leadBlanks; i++) {
      days.push({ isBlank: true, key: `blank-${i}` });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const key = dateKey(calYear, calMonth, d);
      const past = isPast(calYear, calMonth, d);
      const sun = isSunday(calYear, calMonth, d);
      days.push({ isBlank: false, dayNum: d, key, past, sun });
    }
    return days;
  };

  const handlePrevMonth = () => {
    let m = calMonth - 1;
    let y = calYear;
    if (m < 0) {
      m = 11;
      y--;
    }
    setCalMonth(m);
    setCalYear(y);
  };

  const handleNextMonth = () => {
    let m = calMonth + 1;
    let y = calYear;
    if (m > 11) {
      m = 0;
      y++;
    }
    setCalMonth(m);
    setCalYear(y);
  };

  const handleDateClick = (key, past, sun) => {
    if (past || sun) return;
    setSelectedDate(key);
    setSelectedTime(null);
    setErrorMsg('');
  };

  // Step 1 -> Step 2
  const handleProceedToStep2 = () => {
    if (!selectedDate || !selectedTime) {
      setErrorMsg('Please select a date and an OPD Session Arrival Window.');
      return;
    }
    setErrorMsg('');
    setBookingStep(2);
  };

  // Step 2 -> Step 3 Submission
  const handleConfirmAppointment = (e) => {
    e.preventDefault();
    if (!patientName.trim()) {
      alert('Please enter patient full name.');
      return;
    }
    if (!phone.trim() || phone.trim().length !== 10 || !/^\d+$/.test(phone.trim())) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!age || Number(age) < 1 || Number(age) > 120) {
      alert('Please enter a valid age between 1 and 120.');
      return;
    }

    const payload = {
      patientName: patientName.trim(),
      phone: `+91 ${phone.trim()}`,
      age: Number(age),
      visitedBefore: visitedBefore === 'yes' ? 'Returning Patient' : 'First Visit',
      gender: 'Specified',
      date: selectedDate,
      timeSlot: selectedTime,
      reason: reason.trim() || (visitedBefore === 'yes' ? 'Follow-up Consultation' : 'General Eye Examination'),
      doctorName: DOCTOR_INFO.name,
      doctorAffil: DOCTOR_INFO.affiliation
    };

    const saved = saveAppointment(payload);
    setConfirmedTicket(saved);
    setBookingStep(3);
  };

  const handleResetBooking = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    setPatientName('');
    setPhone('');
    setAge('');
    setReason('');
    setVisitedBefore('no');
    setConfirmedTicket(null);
    setBookingStep(1);
  };

  // Filtered Spectacles
  const filteredProducts = selectedCategory === 'All'
    ? OPTICAL_PRODUCTS
    : OPTICAL_PRODUCTS.filter(p => p.category === selectedCategory);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div>
      
      {/* HEADER - CLEAN & FULLY RESPONSIVE */}
      <header>
        <div className="wrap nav">
          
          <a href="#" className="logo-group">
            <span className="logo-main">👓 FASHION OPTICALS</span>
            <span className="logo-sub">&amp; Eye Clinic</span>
          </a>

          <div className="navlinks">
            <a href="#book">Book Appointment</a>
            <a href="#offers">Offers</a>
            <a href="#eyewear">Spectacles Store</a>
            <a href="#doctor">Doctor Profile</a>
            <a href="#location">Location Map</a>
          </div>

          <div className="navcta">
            <div className="header-phone-box">
              <a href="tel:+919490349868" className="header-phone-main">📞 +91 94903 49868</a>
              <a href="tel:+919948501005" className="header-phone-alt">Alt: +91 99485 01005</a>
            </div>

            <button onClick={() => scrollToSection('book')} className="btn btn-gold">
              Reserve Spot
            </button>

            {/* Mobile Hamburger Toggle */}
            <button 
              className="mobile-menu-btn" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>

        {/* MOBILE MENU DRAWER */}
        {mobileMenuOpen && (
          <div style={{ background: 'var(--paper)', borderBottom: '1px solid var(--line)', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px', fontWeight: 600 }}>
            <a href="#book" onClick={() => scrollToSection('book')}>📅 Book Appointment</a>
            <a href="#offers" onClick={() => scrollToSection('offers')}>✨ Special Offers</a>
            <a href="#eyewear" onClick={() => scrollToSection('eyewear')}>👓 Spectacles Store</a>
            <a href="#doctor" onClick={() => scrollToSection('doctor')}>👨‍⚕️ Doctor Profile</a>
            <a href="#location" onClick={() => scrollToSection('location')}>📍 Clinic Location Map</a>
            
            <div style={{ paddingTop: '12px', borderTop: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a href="tel:+919490349868" style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>📞 Call: +91 94903 49868</a>
              <a href="tel:+919948501005" style={{ color: 'var(--gray)' }}>📞 Alt: +91 99485 01005</a>
              <button 
                onClick={() => { setMobileMenuOpen(false); setShowAdminLoginModal(true); }}
                style={{ background: 'none', border: 'none', textAlign: 'left', color: 'var(--gray)', cursor: 'pointer', fontSize: '13px', paddingTop: '6px' }}
              >
                🔐 Staff Admin Dashboard Link
              </button>
            </div>
          </div>
        )}
      </header>

      {/* CONDITIONAL MAIN CONTAINER */}
      {isAdminView ? (
        <AdminPortalView onExitAdmin={() => setIsAdminView(false)} />
      ) : (
        <main>
          
          {/* HERO SECTION WITH EMBEDDED TOP-FOLD APPOINTMENT BOOKING WIDGET */}
          <section className="hero" id="home" style={{ paddingBottom: '60px' }}>
            <div className="wrap">
              <div className="hero-grid">
                
                {/* Left Column: Doctor Info & Phone Numbers */}
                <div>
                  <div className="eyebrow">Fashion Opticals — Eye Clinic &amp; Spectacles Store, Guntur</div>
                  <h1>See clearly.<br />Look sharp.</h1>
                  <p className="lead">
                    Consult resident Senior Ophthalmologist <strong>Dr. Vuyyuru Raja Sekhar</strong> (MBBS, MS Ophthalmology, 38+ Years Experience). Complete eye health checkups, surgical evaluations &amp; fashion opticals under one roof.
                  </p>
                  
                  {/* LARGE PROMINENT DOCTOR SPOTLIGHT CARD */}
                  <div className="doctor-card" style={{ marginTop: '24px', padding: '0', border: '1px solid var(--line)', borderRadius: '20px', background: 'var(--paper)', boxShadow: '0 12px 32px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', width: '100%', height: '360px', overflow: 'hidden', background: '#e2e8f0' }}>
                      <img 
                        src={doctorImg} 
                        alt="Dr. Vuyyuru Raja Sekhar" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%', display: 'block' }} 
                      />
                      <div style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(11, 19, 43, 0.85)', backdropFilter: 'blur(8px)', color: '#fbbf24', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid rgba(251, 191, 36, 0.4)' }}>
                        <span>★ 38+ Years Experience</span>
                      </div>
                    </div>

                    <div style={{ padding: '20px 24px' }}>
                      <div className="eyebrow" style={{ color: 'var(--accent-gold)', fontWeight: 700, marginBottom: '4px' }}>👨‍⚕️ Resident Senior Eye Specialist</div>
                      <h2 style={{ fontSize: '24px', margin: '2px 0 6px 0', fontFamily: 'Fraunces, serif', color: 'var(--primary-navy)' }}>{DOCTOR_INFO.name}</h2>
                      <div className="cred" style={{ fontSize: '13px', color: 'var(--gray)', fontWeight: 600, marginBottom: '16px' }}>{DOCTOR_INFO.qualifications} • {DOCTOR_INFO.affiliation}</div>
                      
                      <div className="stat-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', paddingTop: '14px', borderTop: '1px solid var(--line)' }}>
                        <div className="stat">
                          <div className="num" style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary-navy)' }}>38+</div>
                          <div className="label" style={{ fontSize: '11px', color: 'var(--gray)' }}>Years exp.</div>
                        </div>
                        <div className="stat">
                          <div className="num" style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent-gold)' }}>97%</div>
                          <div className="label" style={{ fontSize: '11px', color: 'var(--gray)' }}>Recommended</div>
                        </div>
                        <div className="stat">
                          <div className="num" style={{ fontSize: '20px', fontWeight: 800, color: '#0284c7' }}>4</div>
                          <div className="label" style={{ fontSize: '11px', color: 'var(--gray)' }}>Specialities</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: EMBEDDED TOP FOLD BOOKING MODULE */}
                <div id="book" className="book-shell" style={{ alignSelf: 'center', boxShadow: '0 12px 36px rgba(0,0,0,0.12)' }}>
                  <div className="book-head">
                    <div className="steps">
                      <span className={bookingStep === 1 ? 'active' : ''}>01 Date &amp; Session</span>
                      <span className={bookingStep === 2 ? 'active' : ''}>02 Details</span>
                      <span className={bookingStep === 3 ? 'active' : ''}>03 Confirmed</span>
                    </div>
                  </div>

                  <div className="book-body" style={{ padding: '28px 24px' }}>
                    
                    {/* STEP 1: DATE & SESSION */}
                    {bookingStep === 1 && (
                      <div id="view-datetime">
                        <div className="cal-head" style={{ marginBottom: '14px' }}>
                          <div className="month" style={{ fontSize: '18px' }}>
                            {monthNames[calMonth]} {calYear}
                          </div>
                          <div className="cal-nav">
                            <button onClick={handlePrevMonth} type="button">&larr;</button>
                            <button onClick={handleNextMonth} type="button">&rarr;</button>
                          </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="cal-grid">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                            <div key={d} className="cal-dow">{d}</div>
                          ))}

                          {getCalendarDays().map(item => {
                            if (item.isBlank) {
                              return <div key={item.key} className="cal-day blank"></div>;
                            }

                            let classes = "cal-day";
                            if (item.sun) classes += " closed";
                            else if (item.past) classes += " past";
                            else classes += " avail";

                            if (selectedDate === item.key) classes += " selected";

                            return (
                              <div
                                key={item.key}
                                className={classes}
                                style={{ padding: '10px 0', fontSize: '13px' }}
                                onClick={() => handleDateClick(item.key, item.past, item.sun)}
                              >
                                {item.dayNum}
                              </div>
                            );
                          })}
                        </div>

                        <div className="note" style={{ fontSize: '11px', marginTop: '10px' }}>
                          Sundays closed. Mon–Sat OPD: 9:00 AM – 1:00 PM.
                        </div>

                        {/* OPD Session Selection */}
                        {selectedDate && (
                          <div id="slot-section" style={{ marginTop: '18px' }}>
                            <div className="slot-title" style={{ fontSize: '11px', margin: '0 0 10px 0' }}>
                              Arrival Session — {new Date(selectedDate + 'T00:00:00').toDateString().slice(0, 10)}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {ALL_SESSIONS.map(session => {
                                const isPassed = selectedDate ? isSlotPassedStr(selectedDate, session) : false;
                                const isSelected = selectedTime === session;
                                return (
                                  <button
                                    key={session}
                                    type="button"
                                    disabled={isPassed}
                                    className={`btn btn-outline ${isSelected ? 'btn-gold' : ''}`}
                                    style={{
                                      justifyContent: 'space-between',
                                      padding: '10px 14px',
                                      textAlign: 'left',
                                      fontWeight: 600,
                                      fontSize: '12px',
                                      background: isPassed ? '#fee2e2' : undefined,
                                      borderColor: isPassed ? '#fca5a5' : undefined,
                                      color: isPassed ? '#b91c1c' : undefined,
                                      cursor: isPassed ? 'not-allowed' : 'pointer',
                                      opacity: isPassed ? 0.75 : 1
                                    }}
                                    onClick={() => {
                                      if (isPassed) return;
                                      setSelectedTime(session);
                                      setErrorMsg('');
                                    }}
                                  >
                                    <span>{session}</span>
                                    <span style={{ fontWeight: 700 }}>
                                      {isPassed ? '✕ TIME EXPIRED' : isSelected ? '✓ SELECTED' : 'SELECT'}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {errorMsg && (
                          <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '12px', fontWeight: 600 }}>
                            {errorMsg}
                          </div>
                        )}

                        <div style={{ marginTop: '20px' }}>
                          <button
                            className="btn btn-block"
                            disabled={!selectedDate || !selectedTime}
                            onClick={handleProceedToStep2}
                            type="button"
                          >
                            Reserve Spot &rarr;
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 2: YOUR DETAILS */}
                    {bookingStep === 2 && (
                      <div id="view-details">
                        <form onSubmit={handleConfirmAppointment}>
                          <div className="form-grid">
                            <div className="field full">
                              <label htmlFor="f-name">Patient name *</label>
                              <input
                                type="text"
                                id="f-name"
                                placeholder="Full name"
                                value={patientName}
                                onChange={e => setPatientName(e.target.value)}
                                required
                              />
                            </div>

                            <div className="field">
                              <label htmlFor="f-phone">Phone number *</label>
                              <input
                                type="tel"
                                id="f-phone"
                                placeholder="Enter 10-digit mobile number"
                                maxLength={10}
                                value={phone}
                                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                                required
                              />
                            </div>

                            <div className="field">
                              <label htmlFor="f-age">Age *</label>
                              <input
                                type="number"
                                id="f-age"
                                placeholder="Age"
                                min={1}
                                max={120}
                                value={age}
                                onChange={e => setAge(e.target.value)}
                                required
                              />
                            </div>

                            {/* Visited Before Toggle */}
                            <div className="field full">
                              <label>Visited Dr. Sekhar before?</label>
                              <div className="toggle-row">
                                <button
                                  type="button"
                                  className={visitedBefore === 'no' ? 'active' : ''}
                                  onClick={() => setVisitedBefore('no')}
                                >
                                  First visit
                                </button>
                                <button
                                  type="button"
                                  className={visitedBefore === 'yes' ? 'active' : ''}
                                  onClick={() => setVisitedBefore('yes')}
                                >
                                  Returning patient
                                </button>
                              </div>
                            </div>

                            <div className="field full">
                              <label htmlFor="f-reason">Note for doctor (optional)</label>
                              <textarea
                                id="f-reason"
                                rows={2}
                                placeholder="Cataract, spectacles test, eye pain..."
                                value={reason}
                                onChange={e => setReason(e.target.value)}
                              />
                            </div>
                          </div>

                          <div style={{ margin: '8px 0 16px' }}>
                            <div className="summary-line" style={{ fontSize: '13px', padding: '8px 0' }}>
                              <span>Selected Date</span>
                              <span>{new Date(selectedDate + 'T00:00:00').toDateString()}</span>
                            </div>
                            <div className="summary-line" style={{ fontSize: '13px', padding: '8px 0' }}>
                              <span>OPD Session</span>
                              <span>{selectedTime}</span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              type="button"
                              className="btn btn-outline"
                              onClick={() => setBookingStep(1)}
                              style={{ padding: '10px 14px' }}
                            >
                              &larr; Back
                            </button>
                            <button type="submit" className="btn" style={{ flex: 1, padding: '10px 14px' }}>
                              Confirm Booking
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* STEP 3: CONFIRMED */}
                    {bookingStep === 3 && confirmedTicket && (
                      <div id="view-confirm">
                        <div className="confirm" style={{ padding: '10px 0' }}>
                          <div className="mark" style={{ fontSize: '32px', marginBottom: '4px' }}>Appointment confirmed</div>
                          <p style={{ color: 'var(--gray)', fontSize: '12px' }}>
                            Your consultation pass has been generated.
                          </p>

                          <div className="ticket" style={{ margin: '16px auto', maxWidth: '100%' }}>
                            <div className="ticket-top" style={{ padding: '16px' }}>
                              <div className="k">{confirmedTicket.doctorName} ({confirmedTicket.doctorAffil})</div>
                              <div style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', marginTop: '2px' }}>
                                Fashion Opticals &amp; Eye Clinic
                              </div>
                            </div>

                            <div className="ticket-row" style={{ padding: '10px 16px', fontSize: '12px' }}>
                              <span>Patient</span>
                              <span>{confirmedTicket.patientName}</span>
                            </div>
                            <div className="ticket-row" style={{ padding: '10px 16px', fontSize: '12px' }}>
                              <span>Phone</span>
                              <span>{confirmedTicket.phone}</span>
                            </div>
                            <div className="ticket-row" style={{ padding: '10px 16px', fontSize: '12px' }}>
                              <span>Date &amp; Session</span>
                              <span>{new Date(confirmedTicket.date + 'T00:00:00').toDateString().slice(0,10)} • {confirmedTicket.timeSlot}</span>
                            </div>
                            
                            <div className="ticket-id" style={{ padding: '12px', fontSize: '13px' }}>
                              Appointment ID · {confirmedTicket.id}
                            </div>
                          </div>

                          <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                            <button onClick={() => window.print()} className="btn btn-outline" style={{ flex: 1, padding: '8px 12px', fontSize: '12px' }}>
                              Print Pass
                            </button>
                            <button onClick={handleResetBooking} className="btn" style={{ flex: 1, padding: '8px 12px', fontSize: '12px' }}>
                              Book Another
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>

              </div>

              <div className="strip">
                <div>
                  <div className="k">Clinic hours</div>
                  <div className="v">Mon–Sat, 9 AM – 1 PM</div>
                </div>
                <div>
                  <div className="k">Primary Desk Phone</div>
                  <div className="v">+91 94903 49868</div>
                </div>
                <div>
                  <div className="k">Alternate Line</div>
                  <div className="v">+91 99485 01005</div>
                </div>
                <div>
                  <div className="k">Opticals</div>
                  <div className="v">Frames &amp; lenses</div>
                </div>
              </div>
            </div>
          </section>

          {/* EXTRAORDINARY SPECTACLES OFFERS SECTION (₹499, ₹599, ₹699) */}
          <section id="offers" className="special-tiers-section">
            <div className="wrap">
              <div className="section-head">
                <div>
                  <div className="eyebrow">Extraordinary Value Spectacles Packages</div>
                  <h2>Exclusive Frame + Lens Combos</h2>
                </div>
                <div className="eyebrow" style={{ fontStyle: 'italic', textTransform: 'none' }}>
                  *Terms &amp; Conditions Apply
                </div>
              </div>

              <div className="tiers-grid">
                {SPECIAL_TIER_OFFERS.map((tier) => (
                  <div 
                    key={tier.id} 
                    className={`tier-card ${tier.price === 599 ? 'featured' : ''}`}
                  >
                    <div className="tier-top-bar">
                      <span className="tier-badge">{tier.badge}</span>
                      <div className="tier-price-wrap">
                        <span className="tier-price">₹{tier.price}</span>
                        <del>₹{tier.originalPrice}</del>
                      </div>
                      <h3 className="tier-title">{tier.title}</h3>
                      <p className="tier-subtitle">{tier.subtitle}</p>
                    </div>

                    <div className="tier-img-box">
                      <img src={tier.image} alt={tier.title} className="tier-img" />
                    </div>

                    <div className="tier-features-list">
                      {tier.features.map((feat, idx) => (
                        <div key={idx} className="tier-feature-item">
                          <span className="check-mark">✓</span>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    <div className="tier-action-box">
                      <button 
                        onClick={() => {
                          setReservedSpectacle({
                            name: `${tier.title} Package (₹${tier.price})`,
                            price: tier.price,
                            originalPrice: tier.originalPrice,
                            badge: tier.badge,
                            description: `${tier.subtitle} • ${tier.features.join(' • ')}`,
                            tc: tier.tc
                          });
                        }}
                        className={`btn btn-block ${tier.price === 599 ? 'btn-gold' : ''}`}
                      >
                        Reserve Spot @ ₹{tier.price}
                      </button>
                      <div className="tc-note">{tier.tc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SPECTACLES & FASHION OPTICALS GALLERY (10+ Items) */}
          <section id="eyewear" style={{ padding: '70px 0' }}>
            <div className="wrap">
              <div className="section-head">
                <div>
                  <div className="eyebrow">Curated Eyewear Collection</div>
                  <h2>Fashion Opticals Catalog</h2>
                </div>
                <div className="eyebrow">Reserve Your Eyewear Frame &amp; Spot</div>
              </div>

              {/* Category Filter Pills */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
                {['All', 'Eyeglasses', 'Sunglasses', 'Blue-Light Glasses', 'Lens Options'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`btn btn-outline ${selectedCategory === cat ? 'btn-gold' : ''}`}
                    style={{ padding: '8px 16px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Spectacles Product Grid */}
              <div className="eyewear-grid">
                {filteredProducts.map((prod) => (
                  <div key={prod.id} className="spectacle-card">
                    <div className="spectacle-img-box">
                      <img src={prod.image} alt={prod.name} className="spectacle-img" />
                      {prod.badge && <span className="spectacle-tag">{prod.badge}</span>}
                    </div>

                    <div className="spectacle-body">
                      <span className="spectacle-cat">{prod.category} • {prod.gender}</span>
                      <h3 className="spectacle-title">{prod.name}</h3>
                      <p className="spectacle-desc">{prod.description}</p>

                      <div className="spectacle-footer">
                        <div className="spectacle-price">
                          ₹{prod.price.toLocaleString('en-IN')}
                          {prod.originalPrice && <del>₹{prod.originalPrice.toLocaleString('en-IN')}</del>}
                        </div>

                        <button 
                          onClick={() => setReservedSpectacle(prod)}
                          className="btn btn-outline"
                          style={{ padding: '8px 14px', fontSize: '12px' }}
                        >
                          Reserve Spot
                        </button>
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--gray)', fontStyle: 'italic', marginTop: '6px' }}>
                        {prod.tc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* DOCTOR & SPECIALITIES */}
          <section id="doctor" style={{ padding: '70px 0', borderTop: '1px solid var(--line)' }}>
            <div className="wrap">
              <div className="section-head">
                <div>
                  <div className="eyebrow">38+ Years Surgical Expertise</div>
                  <h2>Meet Dr. Vuyyuru Raja Sekhar</h2>
                </div>
                <div className="eyebrow">Resident Senior Specialist</div>
              </div>

              {/* IN-CLINIC EYE TESTING SHOWCASE WITH GIRL PATIENT */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                <div style={{ border: '1px solid var(--line)', borderRadius: '16px', overflow: 'hidden', background: 'var(--paper)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
                  <img 
                    src={eyeExamImg} 
                    alt="Dr. Vuyyuru Raja Sekhar performing eye examination on girl patient with ARK refraction machine" 
                    style={{ width: '100%', height: '320px', objectFit: 'cover', objectPosition: 'center 30%', display: 'block' }} 
                  />
                  <div style={{ padding: '20px 24px', background: '#f8fafc', borderTop: '1px solid var(--line)' }}>
                    <div className="eyebrow" style={{ color: '#0284c7', fontWeight: 700 }}>📷 In-Clinic Diagnostic Examination</div>
                    <h3 style={{ fontSize: '20px', margin: '6px 0', color: 'var(--primary-navy)' }}>Computerized Eye Testing Room</h3>
                    <p style={{ color: 'var(--gray)', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
                      Dr. Vuyyuru Raja Sekhar conducting automated ARK computerized refractive error testing and corneal inspection on a patient at Fashion Opticals &amp; Eye Clinic, Kanna Vari Thota, Guntur.
                    </p>
                  </div>
                </div>

                <div style={{ border: '1px solid var(--line)', borderRadius: '16px', padding: '28px', background: 'var(--paper)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div className="eyebrow" style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>Senior Specialist Care</div>
                  <h3 style={{ fontSize: '22px', margin: '8px 0 12px 0' }}>Comprehensive Eye Examinations</h3>
                  <p style={{ color: 'var(--gray)', fontSize: '14px', lineHeight: '1.6', marginBottom: '18px' }}>
                    With over 38 years of dedicated clinical expertise, Dr. Vuyyuru Raja Sekhar provides advanced diagnostic evaluations for patients of all ages.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 600 }}>
                      <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '16px' }}>✓</span> Computerized ARK Refraction &amp; Vision Testing
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 600 }}>
                      <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '16px' }}>✓</span> Cataract, IOL &amp; Surgical Consultation
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 600 }}>
                      <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '16px' }}>✓</span> Glaucoma Pressure &amp; Fundus Screening
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 600 }}>
                      <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '16px' }}>✓</span> Precision Eyeglass Power &amp; Lens Fitting
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid-4">
                <div className="cell">
                  <div className="n">01</div>
                  <h3>Cataract</h3>
                  <p>Diagnosis, phacoemulsification &amp; micro-incision surgery.</p>
                </div>
                <div className="cell">
                  <div className="n">02</div>
                  <h3>Glaucoma</h3>
                  <p>IOP screening, laser trabeculoplasty &amp; management.</p>
                </div>
                <div className="cell">
                  <div className="n">03</div>
                  <h3>Cornea</h3>
                  <p>Treatment, pterygium excision &amp; corneal transplant.</p>
                </div>
                <div className="cell">
                  <div className="n">04</div>
                  <h3>Refractive surgery</h3>
                  <p>LASIK laser vision correction to remove glasses.</p>
                </div>
              </div>
            </div>
          </section>

          {/* GOOGLE MAP LOCATION EMBED SECTION */}
          <section id="location" className="map-section">
            <div className="wrap">
              <div className="section-head">
                <div>
                  <div className="eyebrow">Clinic Address &amp; Directions</div>
                  <h2>Find Us on Google Maps</h2>
                </div>
                <div className="eyebrow">Fashion Opticals &amp; Eye Clinic</div>
              </div>

              <div className="map-card">
                <div className="map-info-bar">
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '16px' }}>Fashion Opticals &amp; Eye Clinic</div>
                    <div style={{ color: 'var(--gray)', fontSize: '13px', marginTop: '2px' }}>
                      Kanna Vari Thota, Guntur Clinic Location
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <a href="tel:+919490349868" className="btn btn-gold" style={{ padding: '8px 14px', fontSize: '12px' }}>
                      <Phone size={14} /> Call: +91 94903 49868
                    </a>
                    <a 
                      href="https://maps.google.com/?q=Sanjeevi+Eye+Clinic+Guntur" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-outline" 
                      style={{ padding: '8px 14px', fontSize: '12px' }}
                    >
                      <ExternalLink size={14} /> Get Directions
                    </a>
                  </div>
                </div>

                {/* RESPONSIVE GOOGLE MAP EMBED IFRAME */}
                <div className="map-iframe-container">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3829.1443371601645!2d80.43486257525566!3d16.315567632795947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4a755f398c058b%3A0x20ddc179a24e894!2sSanjeevi%20Eye%20Clinic!5e0!3m2!1sen!2sin!4v1785055976936!5m2!1sen!2sin" 
                    title="Fashion Opticals & Eye Clinic Location"
                    loading="lazy" 
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SPECTACLE RESERVATION MODAL */}
          {reservedSpectacle && (
            <div className="modal-overlay" onClick={() => setReservedSpectacle(null)}>
              <div className="modal-card" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={() => setReservedSpectacle(null)}>×</button>

                <div className="eyebrow" style={{ marginBottom: '8px' }}>Frame Reservation Inquiry</div>
                <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>{reservedSpectacle.name}</h2>
                <p style={{ color: 'var(--gray)', fontSize: '13px', marginBottom: '16px' }}>
                  {reservedSpectacle.description}
                </p>

                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '32px', fontWeight: 600, marginBottom: '6px' }}>
                  ₹{reservedSpectacle.price.toLocaleString('en-IN')}
                  {reservedSpectacle.originalPrice && (
                    <del style={{ fontSize: '16px', color: 'var(--gray)', marginLeft: '10px' }}>
                      ₹{reservedSpectacle.originalPrice.toLocaleString('en-IN')}
                    </del>
                  )}
                </div>

                <div style={{ fontSize: '11px', color: 'var(--gray)', fontStyle: 'italic', marginBottom: '20px' }}>
                  {reservedSpectacle.tc || '*T&C Apply: Offer subject to power range availability.'}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <a
                    href={`https://wa.me/919490349868?text=Hello%20Fashion%20Opticals,%20I%20want%20to%20reserve/inquire%20about%20the%20spectacle%20frame:%20${encodeURIComponent(reservedSpectacle.name)}%20(Rs.${reservedSpectacle.price}).`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-block"
                    style={{ background: '#16a34a', borderColor: '#16a34a' }}
                  >
                    Reserve Frame via WhatsApp
                  </a>

                  <a href="tel:+919490349868" className="btn btn-outline btn-block">
                    Call Desk: +91 94903 49868
                  </a>
                  <a href="tel:+919948501005" className="btn btn-outline btn-block">
                    Alt Line: +91 99485 01005
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* DISCREET ADMIN LOGIN MODAL */}
          {showAdminLoginModal && (
            <div className="modal-overlay" onClick={() => setShowAdminLoginModal(false)}>
              <div className="modal-card" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={() => setShowAdminLoginModal(false)}>×</button>
                <div className="eyebrow" style={{ marginBottom: '6px' }}>Staff Access Protection</div>
                <h3 style={{ fontSize: '22px', marginBottom: '16px' }}>Clinic Admin Login</h3>

                {loginError && (
                  <div style={{ color: '#dc2626', fontSize: '13px', marginBottom: '14px', background: '#fee2e2', padding: '10px', borderRadius: '4px' }}>
                    {loginError}
                  </div>
                )}

                <form onSubmit={handleAdminLogin}>
                  <div className="field">
                    <label>Username</label>
                    <input
                      type="text"
                      placeholder="admin"
                      value={adminUsername}
                      onChange={e => setAdminUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="field">
                    <label>Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={adminPassword}
                      onChange={e => setAdminPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-block" style={{ marginTop: '12px' }}>
                    Login to Admin Dashboard &amp; Database
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* FLOATING QUICK CALL & BOOK BAR ON MOBILE */}
          <div className="mobile-bottom-bar">
            <div className="mobile-bottom-bar-content">
              <a href="tel:+919490349868" className="btn btn-gold" style={{ flex: 1, padding: '10px', fontSize: '12px' }}>
                <Phone size={14} /> Call Desk
              </a>
              <button onClick={() => scrollToSection('book')} className="btn" style={{ flex: 1, padding: '10px', fontSize: '12px' }}>
                📅 Reserve Spot
              </button>
            </div>
          </div>

          {/* FOOTER */}
          <footer>
            <div className="wrap foot-row" onDoubleClick={() => setShowAdminLoginModal(true)}>
              <div>Fashion Opticals &amp; Eye Clinic — Guntur</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span>Mon–Sat, 9:00 AM – 1:00 PM · Closed Sunday · Phone: +91 94903 49868</span>
                <button 
                  onClick={() => setShowAdminLoginModal(true)} 
                  style={{ background: 'none', border: 'none', color: 'var(--gray)', cursor: 'pointer', fontSize: '12px', textDecoration: 'underline' }}
                >
                  Admin Link
                </button>
              </div>
            </div>
          </footer>

        </main>
      )}

    </div>
  );
}

// STAFF ADMIN PORTAL & REAL-TIME DATABASE MANAGER COMPONENT
function AdminPortalView({ onExitAdmin }) {
  const [selectedDate, setSelectedDate] = useState('ALL'); // 'ALL' or YYYY-MM-DD
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'database'
  const [isBackendConnected, setIsBackendConnected] = useState(true);

  // Walk-in modal
  const [showWalkin, setShowWalkin] = useState(false);
  const [wName, setWName] = useState('');
  const [wPhone, setWPhone] = useState('');
  const [wAge, setWAge] = useState('');
  const [wSlot, setWSlot] = useState('');

  const refreshData = async () => {
    // Synchronously display local cache first for instant 0ms rendering
    setAppointments(getAppointments());
    // Asynchronously sync with backend server
    const data = await fetchAppointmentsFromBackend(selectedDate);
    setAppointments(data);
  };

  useEffect(() => {
    refreshData();

    // Listen for cross-tab and local appointment-updated events
    window.addEventListener('storage', refreshData);
    window.addEventListener('appointment-updated', refreshData);

    // Auto-poll backend every 3 seconds for instant real-time sync across devices
    const interval = setInterval(() => {
      refreshData();
    }, 3000);

    return () => {
      window.removeEventListener('storage', refreshData);
      window.removeEventListener('appointment-updated', refreshData);
      clearInterval(interval);
    };
  }, [selectedDate]);

  // Filter appointments
  const filteredApps = appointments.filter(a => {
    const matchDate = selectedDate === 'ALL' || a.date === selectedDate;
    const matchStatus = statusFilter === 'All' || a.status === statusFilter;
    const matchSearch = a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || a.phone.includes(searchTerm) || a.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchDate && matchStatus && matchSearch;
  });

  const handleStatus = async (id, newStat) => {
    updateAppointmentStatus(id, newStat);
    await refreshData();
  };

  const handleWalkinSubmit = async (e) => {
    e.preventDefault();
    if (!wName || !wPhone || !wSlot) return;

    saveAppointment({
      patientName: wName.trim(),
      phone: `+91 ${wPhone.trim()}`,
      age: Number(wAge) || 35,
      visitedBefore: 'First Visit',
      gender: 'Specified',
      date: new Date().toISOString().split('T')[0],
      timeSlot: wSlot,
      reason: 'Walk-in Consultation',
      doctorName: DOCTOR_INFO.name,
      doctorAffil: DOCTOR_INFO.affiliation
    });

    await refreshData();
    setShowWalkin(false);
    setWName(''); setWPhone(''); setWAge(''); setWSlot('');
  };

  // Export Database Records to CSV
  const handleExportCSV = () => {
    if (appointments.length === 0) {
      alert("No appointment records available to export.");
      return;
    }
    const headers = ["ID", "Patient Name", "Phone", "Age", "Visit Type", "Date", "OPD Session", "Status", "Created At"];
    const rows = appointments.map(a => [
      a.id,
      `"${a.patientName}"`,
      `"${a.phone}"`,
      a.age,
      `"${a.visitedBefore}"`,
      a.date,
      `"${a.timeSlot}"`,
      a.status,
      a.createdAt
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `fashion_opticals_database_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Clear Database via Backend
  const handleClearDatabase = async () => {
    if (window.confirm("Are you sure you want to clear all stored appointment records from the backend database? This action cannot be undone.")) {
      try {
        await fetch('http://localhost:5001/api/appointments', { method: 'DELETE' });
        localStorage.removeItem('fashion_opticals_appointments');
        await refreshData();
      } catch (e) {
        localStorage.removeItem('fashion_opticals_appointments');
        await refreshData();
      }
    }
  };

  const handleDeleteAppointment = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete appointment ${id} for "${name}"?`)) {
      deleteAppointment(id);
      await refreshData();
    }
  };

  const ALL_SESSIONS = generateTimeSlots();

  return (
    <div className="wrap" style={{ padding: '30px 16px' }}>
      
      {/* Admin Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--line)', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="eyebrow">Database API Connected:</span>
            <span style={{ fontSize: '11px', background: '#dcfce7', color: '#15803d', fontWeight: 700, padding: '2px 8px', borderRadius: '12px' }}>
              ● LIVE ({typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5001' : 'Vercel Cloud Database API'})
            </span>
          </div>
          <h1 style={{ fontSize: '24px', marginTop: '4px' }}>Fashion Opticals Control Center</h1>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={refreshData} className="btn btn-outline" style={{ fontSize: '12px', padding: '8px 12px' }}>
            <RefreshCw size={14} /> Refresh DB
          </button>
          <button onClick={() => setShowWalkin(true)} className="btn btn-gold" style={{ fontSize: '12px', padding: '8px 12px' }}>
            <PlusCircle size={14} /> + Walk-in
          </button>
          <button onClick={onExitAdmin} className="btn btn-outline" style={{ fontSize: '12px', padding: '8px 12px' }}>
            Exit Admin
          </button>
        </div>
      </div>

      {/* Navigation Tabs (Queue vs Database Inspector) */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('queue')}
          className={`btn ${activeTab === 'queue' ? 'btn-gold' : 'btn-outline'}`}
          style={{ padding: '8px 16px', fontSize: '12px' }}
        >
          📅 OPD Queue ({appointments.length})
        </button>
        <button
          onClick={() => setActiveTab('database')}
          className={`btn ${activeTab === 'database' ? 'btn-gold' : 'btn-outline'}`}
          style={{ padding: '8px 16px', fontSize: '12px' }}
        >
          <Database size={14} /> Backend Database ({appointments.length})
        </button>
      </div>

      {/* TAB 1: DAILY & ALL OPD QUEUE */}
      {activeTab === 'queue' && (
        <div>
          {/* Date & Filter Controls */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button
                onClick={() => setSelectedDate('ALL')}
                className={`btn btn-outline ${selectedDate === 'ALL' ? 'btn-gold' : ''}`}
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                All Dates ({appointments.length})
              </button>

              <input
                type="date"
                value={selectedDate === 'ALL' ? '' : selectedDate}
                onChange={e => setSelectedDate(e.target.value || 'ALL')}
                style={{ padding: '6px 10px', border: '1px solid var(--line)', fontFamily: 'Inter, sans-serif', borderRadius: '6px', fontSize: '12px' }}
              />
            </div>

            <div style={{ flex: 1, display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['All', 'Confirmed', 'Arrived', 'Completed', 'Cancelled'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`btn btn-outline ${statusFilter === st ? 'btn-gold' : ''}`}
                  style={{ padding: '6px 10px', fontSize: '11px', textTransform: 'uppercase' }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div style={{ border: '1px solid var(--line)', borderRadius: '12px', overflow: 'hidden', background: 'var(--paper)', marginBottom: '40px' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)', background: 'var(--off)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <span style={{ fontWeight: 600, fontSize: '13px' }}>
                Showing {filteredApps.length} Appointments {selectedDate !== 'ALL' && `for ${selectedDate}`}
              </span>
              <input
                type="text"
                placeholder="Search patient name, ID or phone..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ padding: '6px 12px', border: '1px solid var(--line)', fontSize: '12px', width: '220px', borderRadius: '6px' }}
              />
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left', minWidth: '650px' }}>
                <thead>
                  <tr style={{ background: 'var(--paper)', borderBottom: '1px solid var(--line)' }}>
                    <th style={{ padding: '10px 14px' }}>Date &amp; Session</th>
                    <th style={{ padding: '10px 14px' }}>Appt ID</th>
                    <th style={{ padding: '10px 14px' }}>Patient Details</th>
                    <th style={{ padding: '10px 14px' }}>Phone</th>
                    <th style={{ padding: '10px 14px' }}>Visit Type</th>
                    <th style={{ padding: '10px 14px' }}>Status</th>
                    <th style={{ padding: '10px 14px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApps.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '28px', textAlign: 'center', color: 'var(--gray)' }}>
                        No appointments found matching current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredApps.map(app => (
                      <tr key={app.id} style={{ borderBottom: '1px solid var(--line)' }}>
                        <td style={{ padding: '10px 14px' }}>
                          <div style={{ fontWeight: 700 }}>{app.date}</div>
                          <div style={{ fontSize: '10px', color: 'var(--gray)' }}>{app.timeSlot}</div>
                        </td>
                        <td style={{ padding: '10px 14px', fontFamily: 'monospace' }}>{app.id}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <strong>{app.patientName}</strong> ({app.age} Yrs)
                        </td>
                        <td style={{ padding: '10px 14px' }}>{app.phone}</td>
                        <td style={{ padding: '10px 14px' }}>{app.visitedBefore || 'First Visit'}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '3px 6px',
                            borderRadius: '4px',
                            textTransform: 'uppercase',
                            background: app.status === 'Confirmed' ? '#e0f2fe' : app.status === 'Arrived' ? '#fef3c7' : app.status === 'Completed' ? '#dcfce7' : '#fee2e2',
                            color: app.status === 'Confirmed' ? '#0369a1' : app.status === 'Arrived' ? '#b45309' : app.status === 'Completed' ? '#15803d' : '#b91c1c'
                          }}>
                            {app.status}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                            {app.status === 'Confirmed' && (
                              <button onClick={() => handleStatus(app.id, 'Arrived')} style={{ padding: '3px 6px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer', background: '#fef3c7', border: '1px solid #fcd34d' }}>Arrived</button>
                            )}
                            {(app.status === 'Confirmed' || app.status === 'Arrived') && (
                              <button onClick={() => handleStatus(app.id, 'Completed')} style={{ padding: '3px 6px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer', background: '#dcfce7', border: '1px solid #86efac' }}>Complete</button>
                            )}
                            {app.status !== 'Cancelled' && app.status !== 'Completed' && (
                              <button onClick={() => handleStatus(app.id, 'Cancelled')} style={{ padding: '3px 6px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer', background: '#fee2e2', border: '1px solid #fca5a5' }}>Cancel</button>
                            )}
                            <button 
                              onClick={() => handleDeleteAppointment(app.id, app.patientName)}
                              style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer', background: '#dc2626', border: '1px solid #b91c1c', color: '#ffffff', fontWeight: 700, marginLeft: '4px' }}
                              title="Delete Appointment Entry"
                            >
                              🗑 Delete Entry
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FULL DATABASE INSPECTOR & EXPORTER */}
      {activeTab === 'database' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ fontSize: '18px' }}>Backend File Database (`backend/database.json`)</h2>
              <p style={{ color: 'var(--gray)', fontSize: '12px' }}>Real persistence: All appointments saved permanently in backend folder.</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleExportCSV} className="btn btn-gold" style={{ fontSize: '12px', padding: '6px 12px' }}>
                <Download size={13} /> Export CSV
              </button>
              <button onClick={handleClearDatabase} className="btn btn-outline" style={{ fontSize: '12px', padding: '6px 12px', borderColor: '#dc2626', color: '#dc2626' }}>
                <Trash2 size={13} /> Clear DB
              </button>
            </div>
          </div>

          <div style={{ border: '1px solid var(--line)', borderRadius: '12px', overflow: 'hidden', background: 'var(--paper)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left', minWidth: '650px' }}>
                <thead>
                  <tr style={{ background: 'var(--off)', borderBottom: '1px solid var(--line)' }}>
                    <th style={{ padding: '10px 14px' }}>Appt ID</th>
                    <th style={{ padding: '10px 14px' }}>Patient Name</th>
                    <th style={{ padding: '10px 14px' }}>Phone</th>
                    <th style={{ padding: '10px 14px' }}>Age</th>
                    <th style={{ padding: '10px 14px' }}>Consultation Date</th>
                    <th style={{ padding: '10px 14px' }}>OPD Session</th>
                    <th style={{ padding: '10px 14px' }}>Status</th>
                    <th style={{ padding: '10px 14px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ padding: '28px', textAlign: 'center', color: 'var(--gray)' }}>
                        Backend database is currently empty.
                      </td>
                    </tr>
                  ) : (
                    appointments.map(app => (
                      <tr key={app.id} style={{ borderBottom: '1px solid var(--line)' }}>
                        <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontWeight: 600 }}>{app.id}</td>
                        <td style={{ padding: '10px 14px', fontWeight: 700 }}>{app.patientName}</td>
                        <td style={{ padding: '10px 14px' }}>{app.phone}</td>
                        <td style={{ padding: '10px 14px' }}>{app.age} Yrs</td>
                        <td style={{ padding: '10px 14px' }}>{app.date}</td>
                        <td style={{ padding: '10px 14px' }}>{app.timeSlot}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '3px 6px',
                            borderRadius: '4px',
                            textTransform: 'uppercase',
                            background: app.status === 'Confirmed' ? '#e0f2fe' : app.status === 'Arrived' ? '#fef3c7' : app.status === 'Completed' ? '#dcfce7' : '#fee2e2',
                            color: app.status === 'Confirmed' ? '#0369a1' : app.status === 'Arrived' ? '#b45309' : app.status === 'Completed' ? '#15803d' : '#b91c1c'
                          }}>
                            {app.status}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <button 
                            onClick={() => handleDeleteAppointment(app.id, app.patientName)}
                            style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer', background: '#dc2626', border: '1px solid #b91c1c', color: '#ffffff', fontWeight: 700 }}
                            title="Delete Appointment Entry"
                          >
                            🗑 Delete Entry
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Walk-in Modal */}
      {showWalkin && (
        <div className="modal-overlay" onClick={() => setShowWalkin(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowWalkin(false)}>×</button>
            <h3 style={{ fontSize: '18px', marginBottom: '14px' }}>Register Walk-in Patient</h3>
            <form onSubmit={handleWalkinSubmit}>
              <div className="field">
                <label>Patient Name *</label>
                <input type="text" value={wName} onChange={e => setWName(e.target.value)} required />
              </div>
              <div className="field">
                <label>Mobile Number *</label>
                <input type="tel" value={wPhone} onChange={e => setWPhone(e.target.value)} maxLength={10} required />
              </div>
              <div className="field">
                <label>Age</label>
                <input type="number" value={wAge} onChange={e => setWAge(e.target.value)} />
              </div>
              <div className="field">
                <label>Select Session *</label>
                <select value={wSlot} onChange={e => setWSlot(e.target.value)} required>
                  <option value="">-- Choose Session --</option>
                  {ALL_SESSIONS.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-block" style={{ marginTop: '14px' }}>
                Confirm Walk-in Registration
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
