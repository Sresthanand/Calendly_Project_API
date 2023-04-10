import { Schema, model, Document } from 'mongoose';

// Define interface for Availability model
export interface Availability {
  id?: string;
  hostId: string;
  startTime: Date;
  endTime: Date;
}

// Define document interface for Availability model
export interface AvailabilityDocument extends Availability, Document {}

// Define schema for Availability model
const availabilitySchema = new Schema<AvailabilityDocument>({
  hostId: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
});

// Define model for Availability collection
const AvailabilityModel = model<AvailabilityDocument>('Availability', availabilitySchema);

export default AvailabilityModel;
