import { Router } from 'express'
import CT from './controller.js'
const router = Router()

router.post('/login', CT.LOGIN)

export default router