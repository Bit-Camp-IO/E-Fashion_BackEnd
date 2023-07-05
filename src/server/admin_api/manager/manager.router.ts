import { Router } from "express";
import controller from './manager.controller'
const router = Router()

router.post("/create", controller.create)
export default router
