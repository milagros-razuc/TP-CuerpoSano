const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Clase = sequelize.define('Clase', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
},
  dia_semana: { 
    type: DataTypes.ENUM('Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'),
    allowNull: false 
  },
  hora_inicio: { 
    type: DataTypes.TIME, 
    allowNull: false 
},
  duracion_minutos: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
},
  cupo_maximo: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
},
  id_entrenador: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
}
}, {
  tableName: 'Clase',
  timestamps: false
});

module.exports = Clase;
