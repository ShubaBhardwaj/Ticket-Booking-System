import express from 'express'

export function createApplication(){
    const app = express()

    // Middleware to parse JSON bodies
    app.use(express.json())

    // Sample route
    app.get('/health', (req, res) => {
        res.json({
            message: 'Wellcome to the Ticket Booking System'
        })
    })
    return app
}