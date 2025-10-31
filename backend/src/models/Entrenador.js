const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Entrenador = sequelize.define('Entrenador', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
},
  nombre: {
     type: DataTypes.STRING(255),
    allowNull: false 
    },
  apellido: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
},
  dni: { 
    type: DataTypes.INTEGER,
     allowNull: false,
    unique: true 
},
  telefono: {
     type: DataTypes.STRING(255),
      allowNull: false 
    },
  email: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
}
}, {
  tableName: 'Entrenador',
  timestamps: false
});

module.exports = Entrenador;
