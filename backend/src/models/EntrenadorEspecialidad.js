const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const EntrenadorEspecialidad = sequelize.define('Entrenador_Especialidad', {
  id_entrenador: { 
    type: DataTypes.INTEGER, 
    primaryKey: true 
},
  id_especialidad: { 
    type: DataTypes.INTEGER, 
    primaryKey: true 
}
}, {
  tableName: 'Entrenador_Especialidad',
  timestamps: false
});

module.exports = EntrenadorEspecialidad;
