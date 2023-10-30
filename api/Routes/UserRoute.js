import express from 'express'
import { UpdateUser, addUserCartProducts, addUserFavProducts, removeUserCartProducts, removeUserFavProducts } from '../Controllers/UserController.js';
import { VerifyToken, VerifyUser } from '../Utils/verifyToken.js';

const router = express.Router();
router.use(VerifyToken)
router.put("/updateuser/:userId", VerifyUser, UpdateUser)
router.post("/addUserCartProducts/:userId", VerifyUser, addUserCartProducts)
router.post("/removeUserCartProducts/:userId", VerifyUser, removeUserCartProducts)
router.post("/addUserfavProducts/:userId", VerifyUser, addUserFavProducts)
router.post("/removeUserfavProducts/:userId", VerifyUser, removeUserFavProducts)




export default router