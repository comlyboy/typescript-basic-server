import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

import IUser from './auth.interface';


const AuthSchema = new mongoose.Schema({
    //schema here
});

AuthSchema.plugin(uniqueValidator);

const User = mongoose.model<any>('User', AuthSchema);
export default User;
