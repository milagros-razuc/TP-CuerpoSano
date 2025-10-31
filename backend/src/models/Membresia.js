const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Membresia = sequelize.define('Membresia', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
},
  id_miembro: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
},
  id_tipo: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
},
  fecha_inicio: { 
    type: DataTypes.DATEONLY, 
    allowNull: false 
},
  fecha_fin: { 
    type: DataTypes.DATEONLY, 
    allowNull: false 
},
  estado: { 
    type: DataTypes.ENUM('activa', 'vencida', 'cancelada'), allowNull: false }
}, {
  tableName: 'Membresia',
  timestamps: false
});

module.exports = Membresia;
