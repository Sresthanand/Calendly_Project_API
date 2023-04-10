import { Request, Response } from 'express';
import { Availability, AvailabilityDocument } from '../models/availability.model';
import { Meeting, MeetingDocument } from '../models/meeting.model';

export class AvailabilityController {
  /**
   * Get the availability of the host for a given time range.
   */
  public static async getAvailability(req: Request, res: Response): Promise<void> {
    try {
      const { hostId, start, end } = req.query;

      // Check if the required query parameters are present
      if (!hostId || !start || !end) {
        res.status(400).json({ message: 'Missing required query parameters' });
        return;
      }

      // Find the availability of the host for the given time range
      const availability: AvailabilityDocument | null = await Availability.findOne({
        hostId,
        startTime: { $lte: new Date(end as string) },
        endTime: { $gte: new Date(start as string) },
      });

      if (!availability) {
        res.status(404).json({ message: 'Availability not found' });
        return;
      }

      // Find the meetings scheduled with the host during the given time range
      const meetings: MeetingDocument[] = await Meeting.find({
        hostId,
        startTime: { $lte: new Date(end as string) },
        endTime: { $gte: new Date(start as string) },
      });

      res.status(200).json({ availability, meetings });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

    /**
   * Create the availability of the host for a given time range.
   */
    public static async createAvailability(req: Request, res: Response): Promise<void> {
      try {
        const { hostId, start, end } = req.body;
  
        // Check if the required body parameters are present
        if (!hostId || !start || !end) {
          res.status(400).json({ message: 'Missing required body parameters' });
          return;
        }
  
        // Create the availability of the host for the given time range
        const availability: AvailabilityDocument = await Availability.create({
          hostId,
          startTime: new Date(start as string),
          endTime: new Date(end as string),
        });
  
        res.status(200).json({ availability });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  
    /**
     * Delete the availability of the host for a given time range.
     */
    public static async deleteAvailability(req: Request, res: Response): Promise<void> {
      try {
        const { id } = req.params;
  
        // Delete the availability of the host for the given id
        const deletedAvailability: AvailabilityDocument | null = await Availability.findByIdAndDelete(id);
  
        if (!deletedAvailability) {
          res.status(404).json({ message: 'Availability not found' });
          return;
        }
  
        res.status(200).json({ message: 'Availability deleted successfully' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      }
    

  /**
   * Create or update the availability of the host for a given time range.
   */
  public static async updateAvailability(req: Request, res: Response): Promise<void> {
    try {
      const { hostId, start, end } = req.body;

      // Check if the required body parameters are present
      if (!hostId || !start || !end) {
        res.status(400).json({ message: 'Missing required body parameters' });
        return;
      }

      // Create or update the availability of the host for the given time range
      const availability: AvailabilityDocument = await Availability.findOneAndUpdate(
        { hostId },
        { hostId, startTime: new Date(start as string), endTime: new Date(end as string) },
        { upsert: true, new: true }
      );

      res.status(200).json({ availability });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
