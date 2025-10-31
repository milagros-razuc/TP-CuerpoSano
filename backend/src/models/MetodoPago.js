const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const MetodoPago = sequelize.define('Metodo_Pago', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
},
  nombre: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
}
}, {
  tableName: 'Metodo_Pago',
  timestamps: false
});

module.exports = MetodoPago;
