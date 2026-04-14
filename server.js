import http from 'http'
import { createApplication } from './src/app.js'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 3000


const startServer = async() => {
try {
    
    const server = http.createServer(createApplication())
    
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })

} catch (error) {
    console.error('Error starting server:', error)
}
}

startServer().catch((err) => {
    console.error('Error in startServer:', err)
    process.exit(1)
})