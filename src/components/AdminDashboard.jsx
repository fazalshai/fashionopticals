import React, { useState, useEffect } from 'react';
import { getAppointments, updateAppointmentStatus, getBlockedSlots, toggleBlockSlot, generateTimeSlots, saveAppointment } from '../utils/storage';
import { DOCTOR_INFO } from '../data/mockData';
import { ShieldCheck, Calendar, Clock, UserCheck, CheckCircle2, XCircle, PlusCircle, Lock, Unlock, Phone, Search, RefreshCw } from 'lucide-react';

export const AdminDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const [appointments, setAppointments] = useState([]);
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State for Manual Walk-In Registration
  const [showWalkinModal, setShowWalkinModal] = useState(false);
  const [walkinName, setWalkinName] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [walkinAge, setWalkinAge] = useState('');
  const [walkinGender, setWalkinGender] = useState('Male');
  const [walkinTimeSlot, setWalkinTimeSlot] = useState('');
  const [walkinReason, setWalkinReason] = useState('Walk-in Consultation');

  // Modal State for Slot Locking
  const [showLockModal, setShowLockModal] = useState(false);

  const loadData = () => {
    setAppointments(getAppointments());
    setBlockedSlots(getBlockedSlots());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter appointments for selected date
  const dateAppointments = appointments.filter(a => a.date === selectedDate);

  const filteredAppointments = dateAppointments.filter(a => {
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    const matchesSearch = 
      a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.phone.includes(searchTerm) ||
      a.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Stats calculation
  const totalCount = dateAppointments.length;
  const confirmedCount = dateAppointments.filter(a => a.status === 'Confirmed').length;
  const arrivedCount = dateAppointments.filter(a => a.status === 'Arrived').length;
  const completedCount = dateAppointments.filter(a => a.status === 'Completed').length;
  const cancelledCount = dateAppointments.filter(a => a.status === 'Cancelled').length;

  const handleStatusChange = (id, newStatus) => {
    updateAppointmentStatus(id, newStatus);
    loadData();
  };

  const handleToggleLock = (slot) => {
    toggleBlockSlot(selectedDate, slot, "Doctor Away / Blocked by Admin");
    loadData();
  };

  const handleAddWalkin = (e) => {
    e.preventDefault();
    if (!walkinName || !walkinPhone || !walkinTimeSlot) return;

    saveAppointment({
      patientName: walkinName.trim(),
      phone: walkinPhone.startsWith('+91') ? walkinPhone : `+91 ${walkinPhone.trim()}`,
      age: Number(walkinAge) || 40,
      gender: walkinGender,
      date: selectedDate,
      timeSlot: walkinTimeSlot,
      reason: walkinReason.trim(),
      doctorName: DOCTOR_INFO.name,
      doctorAffil: DOCTOR_INFO.affiliation
    });

    loadData();
    setShowWalkinModal(false);
    setWalkinName('');
    setWalkinPhone('');
    setWalkinAge('');
    setWalkinTimeSlot('');
  };

  const allTimeSlots = generateTimeSlots(); // 09:00 AM to 12:45 PM

  return (
    <div className="admin-container container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      
      {/* Header Banner */}
      <div className="admin-header glass-card dark-glass">
        <div className="admin-title-wrap">
          <div className="admin-badge">
            <ShieldCheck size={16} />
            <span>Clinic Staff Portal</span>
          </div>
          <h2>Fashion Opticals & Eye Clinic Management</h2>
          <p>Doctor: <strong>{DOCTOR_INFO.name}</strong> • OPD Timings: Mon-Sat 09:00 AM - 01:00 PM</p>
        </div>

        <div className="admin-header-actions">
          <button onClick={loadData} className="btn btn-outline-navy btn-sm">
            <RefreshCw size={14} /> Refresh Data
          </button>
          <button onClick={() => setShowWalkinModal(true)} className="btn btn-gold btn-sm">
            <PlusCircle size={15} /> + Add Walk-in Patient
          </button>
          <button onClick={() => setShowLockModal(true)} className="btn btn-secondary btn-sm" style={{ color: 'var(--primary-navy)' }}>
            <Lock size={15} /> Doctor Slot Locker
          </button>
        </div>
      </div>

      {/* Date Picker & Stats Row */}
      <div className="admin-controls-row">
        
        <div className="admin-date-selector glass-card">
          <label htmlFor="adminDate">
            <Calendar size={16} /> View Appointments Date:
          </label>
          <input
            id="adminDate"
            type="date"
            className="form-control"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="stats-pills-wrap">
          <div className="stat-pill total">
            <span className="lbl">Total Patients</span>
            <strong className="val">{totalCount}</strong>
          </div>
          <div className="stat-pill confirmed">
            <span className="lbl">Confirmed</span>
            <strong className="val">{confirmedCount}</strong>
          </div>
          <div className="stat-pill arrived">
            <span className="lbl">Waiting in Desk</span>
            <strong className="val">{arrivedCount}</strong>
          </div>
          <div className="stat-pill completed">
            <span className="lbl">Completed</span>
            <strong className="val">{completedCount}</strong>
          </div>
          <div className="stat-pill cancelled">
            <span className="lbl">Cancelled</span>
            <strong className="val">{cancelledCount}</strong>
          </div>
        </div>

      </div>

      {/* Queue Table Section */}
      <div className="queue-table-card glass-card">
        
        <div className="table-toolbar">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by Patient Name, Phone or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-tabs">
            {['All', 'Confirmed', 'Arrived', 'Completed', 'Cancelled'].map((status) => (
              <button
                key={status}
                className={`filter-tab-btn ${statusFilter === status ? 'active' : ''}`}
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Patients Table */}
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Time Slot</th>
                <th>Appt ID</th>
                <th>Patient Details</th>
                <th>Contact Phone</th>
                <th>Reason / Complaints</th>
                <th>Status</th>
                <th>Staff Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="no-data-cell">
                    No appointments scheduled for {selectedDate} ({statusFilter !== 'All' ? statusFilter : 'All'}).
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((app) => (
                  <tr key={app.id} className={`row-status-${app.status.toLowerCase()}`}>
                    <td className="slot-cell">
                      <Clock size={14} />
                      <strong>{app.timeSlot}</strong>
                    </td>
                    <td className="id-cell">{app.id}</td>
                    <td className="patient-cell">
                      <strong>{app.patientName}</strong>
                      <span className="patient-sub">{app.age} Yrs • {app.gender}</span>
                    </td>
                    <td className="phone-cell">
                      <a href={`tel:${app.phone}`} className="phone-link">
                        <Phone size={13} /> {app.phone}
                      </a>
                    </td>
                    <td className="reason-cell">{app.reason}</td>
                    <td>
                      <span className={`status-badge ${app.status.toLowerCase()}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="actions-cell">
                      {app.status === 'Confirmed' && (
                        <button
                          onClick={() => handleStatusChange(app.id, 'Arrived')}
                          className="btn-action arrived"
                          title="Mark Arrived in Waiting Room"
                        >
                          <UserCheck size={14} /> Arrived
                        </button>
                      )}

                      {(app.status === 'Confirmed' || app.status === 'Arrived') && (
                        <button
                          onClick={() => handleStatusChange(app.id, 'Completed')}
                          className="btn-action completed"
                          title="Mark Consultation Completed"
                        >
                          <CheckCircle2 size={14} /> Completed
                        </button>
                      )}

                      {app.status !== 'Cancelled' && app.status !== 'Completed' && (
                        <button
                          onClick={() => handleStatusChange(app.id, 'Cancelled')}
                          className="btn-action cancel"
                          title="Cancel Appointment"
                        >
                          <XCircle size={14} /> Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* WALK-IN REGISTRATION MODAL */}
      {showWalkinModal && (
        <div className="modal-overlay" onClick={() => setShowWalkinModal(false)}>
          <div className="modal-content glass-card animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Register Walk-in Patient</h3>
              <button className="modal-close" onClick={() => setShowWalkinModal(false)}>×</button>
            </div>

            <form onSubmit={handleAddWalkin}>
              <div className="form-group">
                <label>Patient Name *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={walkinName}
                  onChange={e => setWalkinName(e.target.value)}
                  placeholder="Full Name"
                />
              </div>

              <div className="form-group">
                <label>Mobile Number *</label>
                <input
                  type="tel"
                  className="form-control"
                  required
                  value={walkinPhone}
                  onChange={e => setWalkinPhone(e.target.value)}
                  placeholder="+91 98480 12345"
                />
              </div>

              <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    className="form-control"
                    value={walkinAge}
                    onChange={e => setWalkinAge(e.target.value)}
                    placeholder="e.g. 42"
                  />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select className="form-control" value={walkinGender} onChange={e => setWalkinGender(e.target.value)}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Select Time Slot (9 AM - 1 PM) *</label>
                <select
                  className="form-control"
                  required
                  value={walkinTimeSlot}
                  onChange={e => setWalkinTimeSlot(e.target.value)}
                >
                  <option value="">-- Choose Time Slot --</option>
                  {allTimeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Reason for Consultation</label>
                <input
                  type="text"
                  className="form-control"
                  value={walkinReason}
                  onChange={e => setWalkinReason(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowWalkinModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-gold">Confirm Walk-in Pass</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SLOT LOCKER MODAL */}
      {showLockModal && (
        <div className="modal-overlay" onClick={() => setShowLockModal(false)}>
          <div className="modal-content glass-card animate-fade-in" style={{ maxWidth: '650px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Doctor Availability Slot Locker</h3>
              <button className="modal-close" onClick={() => setShowLockModal(false)}>×</button>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Lock/Unlock specific time slots for Date: <strong>{selectedDate}</strong> (e.g. Doctor is away or on emergency calls).
            </p>

            <div className="lock-slots-grid">
              {allTimeSlots.map(slot => {
                const isBlocked = blockedSlots.some(b => b.date === selectedDate && b.timeSlot === slot);

                return (
                  <button
                    key={slot}
                    onClick={() => handleToggleLock(slot)}
                    className={`lock-slot-btn ${isBlocked ? 'blocked' : 'open'}`}
                  >
                    <span>{slot}</span>
                    <span className="lock-lbl">
                      {isBlocked ? <Lock size={12} /> : <Unlock size={12} />}
                      {isBlocked ? "BLOCKED" : "OPEN"}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="modal-footer" style={{ marginTop: '1.5rem' }}>
              <button className="btn btn-primary" onClick={() => setShowLockModal(false)}>Done</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-container {
          background: #f8fafc;
          min-height: 80vh;
        }
        .admin-header {
          padding: 2rem;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, #0b132b 0%, #1c2541 100%);
        }
        .admin-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(2, 132, 199, 0.2);
          color: #38bdf8;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .admin-title-wrap h2 {
          color: #ffffff;
          font-size: 1.8rem;
          margin-bottom: 0.3rem;
        }
        .admin-title-wrap p {
          color: #94a3b8;
          font-size: 0.9rem;
        }
        .admin-header-actions {
          display: flex;
          gap: 0.75rem;
        }

        .admin-controls-row {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .admin-date-selector {
          padding: 1.25rem;
          border: 1px solid var(--border-light);
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .admin-date-selector label {
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--primary-navy);
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .stats-pills-wrap {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0.85rem;
        }
        .stat-pill {
          background: #ffffff;
          border: 1px solid var(--border-light);
          padding: 0.85rem 1rem;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
        }
        .stat-pill .lbl { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }
        .stat-pill .val { font-size: 1.5rem; font-weight: 800; color: var(--primary-navy); margin-top: 0.2rem; }
        .stat-pill.confirmed .val { color: var(--accent-blue); }
        .stat-pill.arrived .val { color: #d97706; }
        .stat-pill.completed .val { color: #16a34a; }
        .stat-pill.cancelled .val { color: #dc2626; }

        .queue-table-card {
          padding: 1.5rem;
          border: 1px solid var(--border-light);
        }
        .table-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .search-box {
          position: relative;
          flex: 1;
          max-width: 380px;
        }
        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }
        .search-input {
          width: 100%;
          padding: 0.65rem 0.75rem 0.65rem 2.4rem;
          border-radius: var(--radius-sm);
          border: 1.5px solid var(--border-light);
          font-size: 0.88rem;
        }
        .filter-tabs { display: flex; gap: 0.4rem; }
        .filter-tab-btn {
          background: #f1f5f9;
          border: none;
          padding: 0.45rem 0.85rem;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-muted);
          cursor: pointer;
        }
        .filter-tab-btn.active {
          background: var(--primary-navy);
          color: #ffffff;
        }

        .table-responsive { overflow-x: auto; }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.9rem;
        }
        .admin-table th {
          background: #f8fafc;
          padding: 0.85rem 1rem;
          font-weight: 700;
          color: var(--primary-navy);
          border-bottom: 2px solid var(--border-light);
        }
        .admin-table td {
          padding: 0.95rem 1rem;
          border-bottom: 1px solid var(--border-light);
        }
        .slot-cell { display: flex; align-items: center; gap: 0.35rem; color: var(--accent-blue); }
        .id-cell { font-family: monospace; font-size: 0.85rem; font-weight: 700; color: var(--text-muted); }
        .patient-cell strong { display: block; color: var(--primary-navy); }
        .patient-sub { font-size: 0.78rem; color: var(--text-muted); }
        .phone-link { color: var(--text-dark); display: flex; align-items: center; gap: 0.3rem; }
        .reason-cell { max-width: 220px; font-size: 0.82rem; color: var(--text-muted); }
        
        .status-badge {
          font-size: 0.72rem;
          font-weight: 800;
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-full);
          text-transform: uppercase;
        }
        .status-badge.confirmed { background: #e0f2fe; color: #0369a1; }
        .status-badge.arrived { background: #fef3c7; color: #b45309; }
        .status-badge.completed { background: #dcfce7; color: #15803d; }
        .status-badge.cancelled { background: #fee2e2; color: #b91c1c; }

        .actions-cell { display: flex; gap: 0.4rem; }
        .btn-action {
          border: none;
          padding: 0.35rem 0.65rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .btn-action.arrived { background: #fef3c7; color: #b45309; }
        .btn-action.completed { background: #dcfce7; color: #15803d; }
        .btn-action.cancel { background: #fee2e2; color: #b91c1c; }

        .no-data-cell {
          text-align: center;
          padding: 3rem;
          color: var(--text-muted);
        }

        .lock-slots-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
        }
        .lock-slot-btn {
          padding: 0.75rem 0.5rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-light);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-weight: 700;
        }
        .lock-slot-btn.open { background: #ffffff; border-color: #cbd5e1; color: var(--primary-navy); }
        .lock-slot-btn.blocked { background: #fee2e2; border-color: #fca5a5; color: #991b1b; }
        .lock-lbl { font-size: 0.65rem; display: flex; align-items: center; gap: 0.2rem; margin-top: 0.2rem; }

        @media (max-width: 992px) {
          .admin-controls-row { grid-template-columns: 1fr; }
          .stats-pills-wrap { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
    </div>
  );
};
