import express from 'express';
import jwt from 'jsonwebtoken';

import User from './auth.schema';
import { AuthDto } from './auth.dto';


export async function signUp(req: express.Request, res: express.Response) {
    const { email, password }: AuthDto = req.body;

    try {

        // Business logic goes here

        res.status(201).json({
            message: 'Registered successfully!',
        });

    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong!',
        });
    }
}


export async function signIn(req: express.Request, res: express.Response) {
    const { email, password }: AuthDto = req.body;

    try {

        // Business logic goes here

        res.status(200).json({
            message: 'logged in successfully'
        });

    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong!'
        });
    }

}




