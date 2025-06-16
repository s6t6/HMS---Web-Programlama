import express from 'express';
import cors from 'cors';
import session from 'express-session';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.js';
import randevuRoutes from './routes/randevu.js';
import hastaRoutes from './routes/hasta.js';
import polRoutes from './routes/poliklinik.js';
import kurulumRoutes from './routes/kurulum.js';

const app = express();
const PORT = 5000;

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true
}));
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/randevu', randevuRoutes);
app.use('/api/hasta', hastaRoutes);
app.use('/api/poliklinik', polRoutes);
app.use('/api/kurulum', kurulumRoutes);

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde hizmet veriyor.`);
});
