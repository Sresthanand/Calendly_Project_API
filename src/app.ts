import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import { availabilityRouter } from './routes/availability.routes';
import { meetingRouter } from './routes/meeting.routes';
import { userRouter } from './routes/user.routes';
import { swaggerSetup } from '../swagger';


export class App {
  private app: Application;

  swaggerSetup(app);

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  

  private config() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(morgan('dev'));
    this.app.use(cors());
    this.app.use(helmet());
  }

  private routes() {
    this.app.use('/api/v1/availability', availabilityRouter);
    this.app.use('/api/v1/meetings', meetingRouter);
    this.app.use('/api/v1/users', userRouter);
  }

  public start(port: number) {
    this.app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  }
}
