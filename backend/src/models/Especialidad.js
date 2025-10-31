const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Especialidad = sequelize.define('Especialidad', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
},
  nombre: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
}
}, {
  tableName: 'Especialidad',
  timestamps: false
});

module.exports = Especialidad;
