const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Pago = sequelize.define('Pago', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
},
  fecha_pago: { 
    type: DataTypes.DATE, 
    allowNull: false 
},
  monto: { 
    type: DataTypes.DOUBLE, 
    allowNull: false 
},
  id_metodoPago: {
     type: DataTypes.INTEGER, 
     allowNull: false 
    },
  estado_pago: { 
    type: DataTypes.ENUM('pendiente', 'confirmado', 'fallido'), 
    allowNull: false 
},
  id_miembro: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
},
  id_membresia: {
     type: DataTypes.INTEGER, 
     allowNull: false 
    }
}, {
  tableName: 'Pago',
  timestamps: false
});

module.exports = Pago;
