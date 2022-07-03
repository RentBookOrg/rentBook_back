import { Router } from 'express'
import CT from './controller.js'

const router = Router()
router.get('/categories', CT.GET)

export default router