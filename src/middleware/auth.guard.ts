// this file checks for user token presence and if it's valid credentials
// is meant to protect all route from not logged user

import jwt from 'jsonwebtoken';
import express from 'express';

export default async function AuthGuard(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const authorization = req.headers.authorization || "";
        const token = authorization.split(" ")[1];
        const decodedToken: any = jwt.verify(token, 'secret from environmental variable');

        req["userData"] = { userName: decodedToken.userName, userId: decodedToken.userId };
        next();

    } catch (error) {
        res.status(401).json({
            message: "You are not logged in!!!"
        })
    }
};