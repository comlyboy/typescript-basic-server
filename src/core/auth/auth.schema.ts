import mongoose from 'mongoose';

import IUser from './auth.interface';

export const UserSchema = mongoose.model<IUser>('User', new mongoose.Schema({
	// schema here
}));
