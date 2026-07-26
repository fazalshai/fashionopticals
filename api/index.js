import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = '/tmp/database.json';

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
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    } catch (e) {}
  }
}

function readDatabase() {
  initDatabase();
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    return { appointments: [] };
  }
}

function writeDatabase(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (e) {
    return false;
  }
}

// REST API ENDPOINTS
app.get('/api/appointments', (req, res) => {
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
});

app.post('/api/appointments', (req, res) => {
  const { id, patientName, phone, age, visitedBefore, gender, date, timeSlot, reason, doctorName, doctorAffil, status, createdAt } = req.body;

  if (!patientName || !phone || !date || !timeSlot) {
    return res.status(400).json({ success: false, error: 'Missing required patient fields' });
  }

  const db = readDatabase();
  const dateStr = date.replace(/-/g, '');
  const countOnDate = db.appointments.filter(a => a.date === date).length + 1;
  const appointmentId = id || `FO-${dateStr}-${String(countOnDate).padStart(3, '0')}`;

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
    db.appointments.unshift(newAppointment);
  }

  writeDatabase(db);

  res.status(201).json({
    success: true,
    message: 'Appointment saved permanently!',
    data: newAppointment
  });
});

app.patch('/api/appointments/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const db = readDatabase();
  const index = db.appointments.findIndex(a => a.id === id);

  if (index !== -1) {
    db.appointments[index].status = status;
    writeDatabase(db);
  }
  res.json({ success: true, message: 'Status updated' });
});

app.delete('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const db = readDatabase();
  db.appointments = db.appointments.filter(a => a.id !== id);
  writeDatabase(db);
  res.json({ success: true, message: 'Deleted' });
});

app.delete('/api/appointments', (req, res) => {
  const db = readDatabase();
  db.appointments = [];
  writeDatabase(db);
  res.json({ success: true, message: 'Cleared' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'online', timestamp: new Date().toISOString() });
});

export default app;
