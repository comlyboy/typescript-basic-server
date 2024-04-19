import express from 'express';

import { signUp, signIn } from './auth.controller';

export const AuthRoute = express.Router();
AuthRoute.post('/signup', signUp);
AuthRoute.post('/signin', signIn);
