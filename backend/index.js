
require('dotenv').config(); 

const app = require('./src/app');

// AHORA SÍ puedes usar process.env.PORT
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor Cuerpo Sano API corriendo en http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  console.log('🛑 Apagando servidor...');
  server.close(() => {
    console.log('✅ Servidor apagado correctamente.');
    process.exit(0);
  });
});