import { Request, Response } from 'express';
import User from '../models/userModel';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, dob, role } = req.body;
    const newUser = new User({ name, email, password, dob, role });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};
