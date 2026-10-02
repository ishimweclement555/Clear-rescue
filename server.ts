import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createApiRouter } from './src/server/api.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// API endpoints
app.use('/api', createApiRouter());

// Root health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    service: 'CLEAR RESCUE AI Engine',
    region: 'East Africa / Rwanda',
    timestamp: new Date().toISOString(),
  });
});

// Serve frontend in production
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`CLEAR RESCUE AI server running on http://0.0.0.0:${PORT}`);
});
