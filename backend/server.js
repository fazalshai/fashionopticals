import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(cors());
app.use(express.json());

// INITIALIZE DATABASE FILE
function initDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      appointments: [
        {
          id: "FO-20260727-001",
          patientName: "Ramesh Kumar",
          phone: "+91 9490349868",
          age: 46,
          visitedBefore: "Returning Patient",
          gender: "Male",
          date: "2026-07-27",
          timeSlot: "Morning Session (09:00 AM - 10:30 AM)",
          reason: "Cataract Consultation & Eye Checkup",
          doctorName: "Dr. Vuyyuru Raja Sekhar",
          doctorAffil: "Guntur Medical College & Hospital",
          status: "Confirmed",
          createdAt: "2026-07-26T08:00:00Z"
        },
        {
          id: "FO-20260727-002",
          patientName: "Saritha Reddy",
          phone: "+91 9948501005",
          age: 38,
          visitedBefore: "First Visit",
          gender: "Female",
          date: "2026-07-27",
          timeSlot: "Mid-Morning Session (10:30 AM - 12:00 PM)",
          reason: "Vision Testing & Spectacle Prescription",
          doctorName: "Dr. Vuyyuru Raja Sekhar",
          doctorAffil: "Guntur Medical College & Hospital",
          status: "Arrived",
          createdAt: "2026-07-26T08:30:00Z"
        }
      ]
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    console.log('✅ Real Database Created & Initialized: database.json');
  }
}

function readDatabase() {
  initDatabase();
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    console.error('Error reading database file:', e);
    return { appointments: [] };
  }
}

function writeDatabase(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error('Error writing to database file:', e);
    return false;
  }
}

// REST API ENDPOINTS

// 1. GET ALL APPOINTMENTS
app.get('/api/appointments', (req, res) => {
  try {
    const db = readDatabase();
    let appointments = db.appointments || [];

    const { date, search, status } = req.query;

    if (date && date !== 'ALL') {
      appointments = appointments.filter(a => a.date === date);
    }
    if (status && status !== 'All') {
      appointments = appointments.filter(a => a.status === status);
    }
    if (search) {
      const s = search.toLowerCase();
      appointments = appointments.filter(a => 
        a.patientName.toLowerCase().includes(s) || 
        a.phone.includes(s) || 
        a.id.toLowerCase().includes(s)
      );
    }

    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch appointments' });
  }
});

// 2. SAVE NEW APPOINTMENT (REAL BACKEND SAVE)
app.post('/api/appointments', (req, res) => {
  try {
    const { id, patientName, phone, age, visitedBefore, gender, date, timeSlot, reason, doctorName, doctorAffil, status, createdAt } = req.body;

    if (!patientName || !phone || !date || !timeSlot) {
      return res.status(400).json({ success: false, error: 'Missing required patient fields' });
    }

    const db = readDatabase();
    const dateStr = date.replace(/-/g, '');
    const countOnDate = db.appointments.filter(a => a.date === date).length + 1;
    const appointmentId = id || `FO-${dateStr}-${String(countOnDate).padStart(3, '0')}`;

    // Replace if already exists, else insert at top
    const existingIdx = db.appointments.findIndex(a => a.id === appointmentId);

    const newAppointment = {
      id: appointmentId,
      patientName: patientName.trim(),
      phone: phone.trim(),
      age: Number(age) || 30,
      visitedBefore: visitedBefore || 'First Visit',
      gender: gender || 'Specified',
      date,
      timeSlot,
      reason: reason ? reason.trim() : 'General Eye Consultation',
      doctorName: doctorName || 'Dr. Vuyyuru Raja Sekhar',
      doctorAffil: doctorAffil || 'Guntur Medical College & Hospital',
      status: status || 'Confirmed',
      createdAt: createdAt || new Date().toISOString()
    };

    if (existingIdx !== -1) {
      db.appointments[existingIdx] = newAppointment;
    } else {
      db.appointments.unshift(newAppointment); // Newest first
    }

    writeDatabase(db);

    console.log(`📌 REAL PATIENT APPOINTMENT SAVED TO BACKEND DATABASE: ${newAppointment.id} (${newAppointment.patientName})`);

    res.status(201).json({
      success: true,
      message: 'Appointment saved permanently in backend database!',
      data: newAppointment
    });
  } catch (error) {
    console.error('Error saving appointment:', error);
    res.status(500).json({ success: false, error: 'Failed to save appointment to backend database' });
  }
});

// 3. UPDATE APPOINTMENT STATUS
app.patch('/api/appointments/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const db = readDatabase();
    const index = db.appointments.findIndex(a => a.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Appointment ID not found' });
    }

    db.appointments[index].status = status;
    writeDatabase(db);

    res.json({ success: true, message: 'Status updated successfully', data: db.appointments[index] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update appointment status' });
  }
});

// 4. DELETE SINGLE APPOINTMENT
app.delete('/api/appointments/:id', (req, res) => {
  try {
    const { id } = req.params;
    const db = readDatabase();
    db.appointments = db.appointments.filter(a => a.id !== id);
    writeDatabase(db);

    res.json({ success: true, message: 'Appointment removed from backend database' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Delete failed' });
  }
});

// 5. CLEAR ALL APPOINTMENTS
app.delete('/api/appointments', (req, res) => {
  try {
    const db = readDatabase();
    db.appointments = [];
    writeDatabase(db);
    res.json({ success: true, message: 'Backend database cleared' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Clear failed' });
  }
});

// HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({ status: 'online', databaseFile: DB_FILE, timestamp: new Date().toISOString() });
});

// START EXPRESS SERVER
initDatabase();
app.listen(PORT, () => {
  console.log(`🚀 Real Backend Server running on http://localhost:${PORT}`);
  console.log(`📁 Saved Database Path: ${DB_FILE}`);
});
