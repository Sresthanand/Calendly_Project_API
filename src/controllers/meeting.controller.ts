import { Request, Response } from 'express';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { ZodError } from 'zod';

import { Meeting, MeetingDocument } from '../models/meeting.model';

// Initialize Google Calendar API client
const calendar = google.calendar('v3');

// Create a new meeting
export const createMeeting = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const meetingData: MeetingDocument = req.body;

    // Get OAuth2 client from request session
    const { tokens } = req.session;
    if (!tokens) {
      return res.status(401).send({ message: 'User not authenticated' });
    }
    const oauth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
    oauth2Client.setCredentials(tokens);

    // Check if selected time slot is available
    const { startTime, endTime } = meetingData;
    const calendarFreebusyResponse = await calendar.freebusy.query({
      auth: oauth2Client,
      requestBody: {
        timeMin: startTime.toISOString(),
        timeMax: endTime.toISOString(),
        timeZone: 'UTC',
        items: [{ id: 'primary' }],
      },
    });
    const { errors, busy } = calendarFreebusyResponse.data.calendars.primary;
    if (errors.length || busy.length) {
      return res.status(409).send({ message: 'Selected time slot is not available' });
    }

    // Create event on user's calendar
    const event = {
      summary: 'Meeting',
      description: 'Meeting description',
      start: {
        dateTime: startTime.toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'UTC',
      },
      attendees: [
        {
          email: 'guest@example.com',
        },
      ],
    };
    const calendarEventsResponse = await calendar.events.insert({
      auth: oauth2Client,
      calendarId: 'primary',
      requestBody: event,
    });

    // Save meeting to database
    const newMeeting = await Meeting.create({
      hostId: req.session.userId,
      guestId: 'guest_id_here',
      startTime,
      endTime,
    });

    res.status(201).send({ meeting: newMeeting });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).send({ message: 'Validation error', details: error.issues });
    }
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
};

// Get all meetings for a user
export const getMeetingsForUser = async (req: Request, res: Response) => {
  try {
    const meetings = await Meeting.find({ hostId: req.session.userId });
    res.send({ meetings });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
};

// Update an existing meeting
export const updateMeeting = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedMeetingData: Partial<MeetingDocument> = req.body;

    const updatedMeeting = await Meeting.findByIdAndUpdate(id, updatedMeetingData, { new: true });

    if (!updatedMeeting) {
      return res.status(404).send({ message: 'Meeting not found' });
    }

    res.send({ meeting: updatedMeeting });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).send({ message: 'Validation error', details: error.issues });
    }
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
};

// Delete a meeting
export const deleteMeeting = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedMeeting = await Meeting.findByIdAndDelete(id);

    if (!deletedMeeting) {
      return res.status(404).send({ message: 'Meeting not found' });
    }

    res.send({ message: 'Meeting deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
};

