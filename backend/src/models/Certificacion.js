const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Certificacion = sequelize.define('Certificacion', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
},
  nombre: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
},
  entidad_emisora: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
},
  fecha_emision: { 
    type: DataTypes.DATEONLY, 
    allowNull: false 
},
  fecha_vencimiento: { 
    type: DataTypes.DATEONLY, 
    allowNull: false 
},
  id_entrenador: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
}
}, {
  tableName: 'Certificacion',
  timestamps: false
});

module.exports = Certificacion;
