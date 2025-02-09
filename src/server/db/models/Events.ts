import { DataTypes } from 'sequelize';
import { db } from '../database';
import Farms from './Farms';

const Events = db.define('events', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    unique: true,
    allowNull: false,
    autoIncrement: true,
  },
  eventName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: { type: DataTypes.STRING, unique: false, allowNull: false },
  thumbnail: { type: DataTypes.STRING, unique: false, allowNull: false },
  farm_id: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: true,
    references: { model: Farms, key: "id" },
  },
});

export default Events;
