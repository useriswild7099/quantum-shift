import mongoose, { Schema, Document } from 'mongoose';

export interface ICamp extends Document {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  capacity: number;
  currentOccupancy: number;
  status: 'Safe' | 'Overcrowded' | 'Critical';
  supplies: {
    water: number;
    food: number;
    medical: number;
  };
}

const CampSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  capacity: { type: Number, required: true },
  currentOccupancy: { type: Number, required: true },
  status: { type: String, required: true, enum: ['Safe', 'Overcrowded', 'Critical'] },
  supplies: {
    water: { type: Number, required: true },
    food: { type: Number, required: true },
    medical: { type: Number, required: true }
  }
});

export const Camp = mongoose.models.Camp || mongoose.model<ICamp>('Camp', CampSchema);
