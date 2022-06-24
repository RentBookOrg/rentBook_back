import { Router } from 'express'
import CT from './controller.js'
const router = Router()

router.get('/:id/verify/:token', CT.VERIFY)
router.get('/resend/:user_id', CT.RESEND_EMAIL)
router.post('/register', CT.POST)

export default router
