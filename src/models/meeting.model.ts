import mongoose, { Document, Schema } from 'mongoose';

export interface MeetingDocument extends Document {
  hostId: string;
  guestId: string;
  startTime: Date;
  endTime: Date;
}

const meetingSchema = new Schema<MeetingDocument>(
  {
    hostId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    guestId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const Meeting = mongoose.model<MeetingDocument>('Meeting', meetingSchema);
