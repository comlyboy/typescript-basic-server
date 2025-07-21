import mongoose from 'mongoose';

import IUser from './user.interface';

export const UserSchema = mongoose.model<IUser>('User', new mongoose.Schema({
	
}));
