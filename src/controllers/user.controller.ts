import { Request, Response } from 'express';
import { User, UserSchema } from '../models/user.model';

// Get user details
export const getUserDetails = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ _id: req.params.userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Update user details
export const updateUserDetails = async (req: Request, res: Response) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      req.body,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const { email, password } = req.body;
    const newUser = UserSchema.validate({ email, password });

    // Check if user with the same email already exists
    const existingUser = await User.findOne({ email: newUser.email });
    if (existingUser) {
      return res.status(409).send({ message: 'User with the same email already exists' });
    }

    // Hash user password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newUser.password, salt);

    // Save user to database
    const createdUser = await User.create({
      email: newUser.email,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign({ userId: createdUser._id }, process.env.JWT_SECRET);

    // Save token to session
    req.session.tokens = { access_token: token };

    res.status(201).send({ user: createdUser });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).send({ message: 'Validation error', details: error.issues });
    }
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
};

