import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as dotenv from 'dotenv'

dotenv.config();

export function isUser(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (token) {
        try {
            const decoded = jwt.verify(token.toString(), process.env.JWT_SECRET as jwt.Secret) as jwt.JwtPayload;
            
            if (!decoded || !decoded.id) {
                res.status(403).json({
                    message: "Invalid token"
                });
            }
    
            req.body.id = decoded.id;
            next();
        } catch (error) {
            res.status(401).json({
                message: "Invalid Token"
            });
        }
    } else {
        res.status(401).json({
            message: "No token provided"
        });
    }
}