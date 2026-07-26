import { INITIAL_APPOINTMENTS } from '../data/mockData';

// Dynamic API URL: Uses relative route '/api/appointments' on production Vercel, and local server on localhost
const BACKEND_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:5001/api/appointments'
  : '/api/appointments';

const STORAGE_KEY = 'fashion_opticals_appointments';

// 1. GET ALL APPOINTMENTS FROM BACKEND API WITH LOCALSTORAGE FALLBACK
export const getAppointments = () => {
  const local = localStorage.getItem(STORAGE_KEY);
  let appointments = [];
  try {
    appointments = local ? JSON.parse(local) : INITIAL_APPOINTMENTS;
  } catch (e) {
    appointments = INITIAL_APPOINTMENTS;
  }
  return appointments;
};

// ASYNC FETCH FROM REAL BACKEND DATABASE
export const fetchAppointmentsFromBackend = async (date = 'ALL') => {
  try {
    const url = date && date !== 'ALL' ? `${BACKEND_URL}?date=${date}` : BACKEND_URL;
    const res = await fetch(url);
    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        // Synchronize backend data to local cache
        localStorage.setItem(STORAGE_KEY, JSON.stringify(result.data));
        return result.data;
      }
    }
  } catch (err) {
    console.warn('Backend API unreachable, using local storage cache:', err);
  }
  return getAppointments();
};

// 2. SAVE NEW APPOINTMENT (REAL POST TO BACKEND SERVER)
export const saveAppointment = (appointmentData) => {
  // Local immediate fallback save
  const current = getAppointments();
  const dateStr = appointmentData.date.replace(/-/g, '');
  const count = current.filter(a => a.date === appointmentData.date).length + 1;
  const appointmentId = `FO-${dateStr}-${String(count).padStart(3, '0')}`;

  const newRecord = {
    id: appointmentId,
    ...appointmentData,
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  };

  const updated = [newRecord, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // ASYNC POST TO REAL BACKEND DATABASE SERVER
  fetch(BACKEND_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appointmentData)
  })
  .then(res => res.json())
  .then(data => {
    if (data.success && data.data) {
      console.log('✅ Successfully saved to backend database:', data.data);
      // Update local cache with server authoritative record
      const refreshed = getAppointments().map(a => a.id === newRecord.id ? data.data : a);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(refreshed));
      window.dispatchEvent(new Event('storage'));
    }
  })
  .catch(err => {
    console.warn('Saved locally (backend unreachable):', err);
  });

  window.dispatchEvent(new Event('storage'));
  return newRecord;
};

// 3. UPDATE APPOINTMENT STATUS IN BACKEND DATABASE
export const updateAppointmentStatus = (id, newStatus) => {
  const current = getAppointments();
  const updated = current.map(a => a.id === id ? { ...a, status: newStatus } : a);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // PATCH TO BACKEND SERVER
  fetch(`${BACKEND_URL}/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus })
  })
  .then(res => res.json())
  .then(data => {
    console.log('✅ Status updated in backend database:', data);
  })
  .catch(err => {
    console.warn('Updated status locally:', err);
  });

  window.dispatchEvent(new Event('storage'));
  return updated;
};

// 4. BLOCK / UNBLOCK SLOTS
export const getBlockedSlots = () => {
  try {
    const data = localStorage.getItem('fashion_opticals_blocked_slots');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const toggleBlockSlot = (slotKey) => {
  const blocked = getBlockedSlots();
  let updated;
  if (blocked.includes(slotKey)) {
    updated = blocked.filter(s => s !== slotKey);
  } else {
    updated = [...blocked, slotKey];
  }
  localStorage.setItem('fashion_opticals_blocked_slots', JSON.stringify(updated));
  window.dispatchEvent(new Event('storage'));
  return updated;
};

// GENERATE OPD SESSION TIME SLOTS (09:00 AM to 01:00 PM)
export const generateTimeSlots = () => {
  return [
    "Morning Session (09:00 AM - 10:30 AM)",
    "Mid-Morning Session (10:30 AM - 12:00 PM)",
    "Noon Session (12:00 PM - 01:00 PM)"
  ];
};
