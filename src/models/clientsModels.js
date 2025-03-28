import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; 

const Client = sequelize.define('Client', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    names: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    birthday: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: true,
    },
    creationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },        
}, {
    timestamps: false,
    tableName: 'clients'
});

sequelize.sync({ alter: true })
    .then(() => console.log("Tabla 'clients' sincronizada correctamente"))
    .catch(err => console.error("Error al sincronizar la tabla 'clients':", err));

export default Client;
