// models/AsistenciaGimnasio.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const AsistenciaGimnasio = sequelize.define('Asistencia_Gimnasio', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  id_miembro: { type: DataTypes.INTEGER, allowNull: false },
  fecha_hora: { type: DataTypes.DATE, allowNull: false },
  metodo_identificacion: { type: DataTypes.ENUM('codigo_barras','huella'), allowNull: false }
}, {
  tableName: 'Asistencia_Gimnasio',
  timestamps: false
});

module.exports = AsistenciaGimnasio;
