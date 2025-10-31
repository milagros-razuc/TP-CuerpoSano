const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const TipoMembresia = sequelize.define('Tipo_Membresia', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
},
 nombre: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
},
  descripcion: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
},
  precio: { 
    type: DataTypes.DOUBLE, 
    allowNull: false 
},
  duracion_dias: { 
    type: DataTypes.INTEGER, 
    allowNull: false }
}, {
  tableName: 'Tipo_Membresia',
  timestamps: false
});

module.exports = TipoMembresia;
