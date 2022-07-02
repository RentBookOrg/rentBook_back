import { Router } from "express"
import CT from './controller.js'
const router = Router()

router.post('/order/:book_id/:mode', CT.GET_ORDER)
router.get('/order/approve/:book_id/:order_id', CT.APPROVE_RENT)
router.get('/order/reject/:book_id/:order_id', CT.REJECT_RENT)
router.get('/order/buy/approve/:order_id', CT.APPROVE_BUY)
router.get('/order/buy/reject/:order_id', CT.REJECT_BUY)
router.get('/order/rent/restore/:order_id', CT.RESTORE_BOOK)

export default router