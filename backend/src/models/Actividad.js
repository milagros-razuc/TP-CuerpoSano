const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Actividad = sequelize.define('Actividad', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
},
  nombre: { 
    type: DataTypes.STRING(250), 
    allowNull: false 
},
  descripcion: { 
    type: DataTypes.STRING(250), 
    allowNull: true 
},
  nivel_dificultad: { 
    type: DataTypes.ENUM('bajo','medio','alto'), 
    allowNull: false 
}
}, {
  tableName: 'Actividad',
  timestamps: false
});

module.exports = Actividad;
