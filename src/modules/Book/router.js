import { Router } from "express"
import CT from './controller.js'
const router = Router()

router.post('/book/:user_id', CT.POST)
router.get('/book/delete/:user_id/:book_id', CT.DELETE)
router.get('/book/location', CT.GET_BY_LOCATION)
router.get('/book/user', CT.GET_BY_USER_ID)

export default router