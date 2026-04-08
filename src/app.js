import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import initializeDatabase from './config/initDb.js';
import schoolRoutes from './routes/schoolRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Routes
app.use('/api', schoolRoutes);

// Health check 
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'School Management API is running' });
});

// Server start after db ready
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
