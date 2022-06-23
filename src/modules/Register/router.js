import { Router } from 'express'
import CT from './controller.js'
const router = Router()

router.get('/:id/verify/:token', CT.VERIFY)
router.post('/register', CT.POST)

export default router
