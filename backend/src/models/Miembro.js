const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Miembro = sequelize.define('Miembro', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING(100),
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
    allowNull: true,
    validate: { isEmail: true }
  },
  fecha_nacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  fecha_registro: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  foto: {
    type: DataTypes.BLOB('long'),
    allowNull: true
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  metodo_identificacion: {
    type: DataTypes.ENUM('codigo_barras', 'huella'),
    allowNull: false
  },
  codigo_barra: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: true
  },
  huella_digital: {
    type: DataTypes.BLOB('long'),
    allowNull: true
  }
}, {
  tableName: 'Miembro',
  timestamps: false
});

module.exports = Miembro;
