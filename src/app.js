import express from 'express'
import cookieParser from "cookie-parser";
import authRoutes from './modules/auth/auth.routes.js';

export function createApplication(){
    const app = express()

    // Middleware to parse JSON bodies
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    // Sample route
    app.get('/health', (req, res) => {
        res.json({
            message: 'Wellcome to the Ticket Booking System'
        })
    })

    app.use("/api/v1/auth", authRoutes )
    
    return app
}