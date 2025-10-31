const express = require('express');
const cors = require('cors');
const routes = require('./routes/index');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Ruta Raíz 
app.get('/api', (req, res) => {
  res.status(200).json({
    message: "¡Bienvenido a la API de Cuerpo Sano!",
    version: "1.0.0",
    status: "OK",
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

// Rutas
app.use('/api', routes);

// Middleware 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '¡Algo salió mal en el servidor!' });
});

module.exports = app;