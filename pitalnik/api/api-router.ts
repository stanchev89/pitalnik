import express from 'express'
import postRoutes from './controllers/post/index'

const router = express.Router()

router.use('/post', postRoutes)

export default router
