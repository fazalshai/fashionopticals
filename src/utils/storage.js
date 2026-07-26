import { INITIAL_APPOINTMENTS } from '../data/mockData';

// Dynamic API URL: Uses relative route '/api/appointments' on production Vercel, and local server on localhost
const BACKEND_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:5001/api/appointments'
  : '/api/appointments';

const STORAGE_KEY = 'fashion_opticals_appointments';

// 1. GET ALL APPOINTMENTS FROM LOCALSTORAGE
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

// HELPER TO MERGE TWO APPOINTMENT ARRAYS SAFELY BY ID (PREVENT LOSS)
function mergeAppointments(serverList, localList) {
  const map = new Map();

  // Add local records first
  for (const item of localList) {
    if (item && item.id) map.set(item.id, item);
  }

  // Server records take precedence if updated
  for (const item of serverList) {
    if (item && item.id) {
      map.set(item.id, item);
    }
  }

  const merged = Array.from(map.values());
  // Sort newest first by ID or createdAt
  merged.sort((a, b) => (b.id || '').localeCompare(a.id || ''));
  return merged;
}

// ASYNC FETCH FROM REAL BACKEND DATABASE WITH ZERO-LOSS MERGE
export const fetchAppointmentsFromBackend = async (date = 'ALL') => {
  const localApps = getAppointments();
  try {
    const url = date && date !== 'ALL' ? `${BACKEND_URL}?date=${date}` : BACKEND_URL;
    const res = await fetch(url);
    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        const merged = mergeAppointments(result.data, localApps);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        return merged;
      }
    }
  } catch (err) {
    console.warn('Backend API unreachable, returning local storage:', err);
  }
  return localApps;
};

// 2. SAVE NEW APPOINTMENT (ZERO DATA LOSS)
export const saveAppointment = (appointmentData) => {
  const current = getAppointments();
  const dateStr = appointmentData.date.replace(/-/g, '');
  const count = current.filter(a => a.date === appointmentData.date).length + 1;
  const appointmentId = appointmentData.id || `FO-${dateStr}-${String(count).padStart(3, '0')}`;

  const newRecord = {
    id: appointmentId,
    ...appointmentData,
    status: appointmentData.status || 'Confirmed',
    createdAt: appointmentData.createdAt || new Date().toISOString()
  };

  // 1. Immediately save to local storage (instant response)
  const updated = [newRecord, ...current.filter(a => a.id !== appointmentId)];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // Dispatch events immediately so UI updates
  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new CustomEvent('appointment-updated', { detail: newRecord }));

  // 2. Save to Backend Database API
  fetch(BACKEND_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newRecord)
  })
  .then(res => res.json())
  .then(data => {
    if (data.success && data.data) {
      console.log('✅ Appointment saved to backend database:', data.data);
      const latestLocal = getAppointments();
      const merged = mergeAppointments([data.data], latestLocal);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('appointment-updated', { detail: data.data }));
    }
  })
  .catch(err => {
    console.warn('Saved locally (backend unreachable):', err);
  });

  return newRecord;
};

// 3. UPDATE APPOINTMENT STATUS IN BACKEND DATABASE
export const updateAppointmentStatus = (id, newStatus) => {
  const current = getAppointments();
  const updated = current.map(a => a.id === id ? { ...a, status: newStatus } : a);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new CustomEvent('appointment-updated'));

  // PATCH TO BACKEND SERVER
  fetch(`${BACKEND_URL}/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus })
  })
  .then(res => res.json())
  .then(data => {
    console.log('✅ Status updated in backend database:', data);
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('appointment-updated'));
  })
  .catch(err => {
    console.warn('Updated status locally:', err);
  });

  return updated;
};

// 4. DELETE SINGLE APPOINTMENT ENTRY
export const deleteAppointment = (id) => {
  const current = getAppointments();
  const updated = current.filter(a => a.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new CustomEvent('appointment-updated'));

  // DELETE ON BACKEND SERVER
  fetch(`${BACKEND_URL}/${id}`, {
    method: 'DELETE'
  })
  .then(res => res.json())
  .then(data => {
    console.log('✅ Appointment deleted from backend database:', data);
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('appointment-updated'));
  })
  .catch(err => {
    console.warn('Deleted locally:', err);
  });

  return updated;
};

// 5. BLOCK / UNBLOCK SLOTS
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
