const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Ruta Raíz 
app.get('/', (req, res) => {
  res.status(200).json({
    message: "¡Bienvenido a la API de Cuerpo Sano!",
    version: "1.0.0",
    status: "OK",
    timestamp: new Date().toISOString()
  });
});

// Aquí luego conectarás tus otras rutas:
// app.use('/api/miembros', require('./routes/miembros'));
// app.use('/api/membresias', require('./routes/membresias'));
// ... etc

// Middleware de manejo de errores (opcional por ahora)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '¡Algo salió mal en el servidor!' });
});

module.exports = app;