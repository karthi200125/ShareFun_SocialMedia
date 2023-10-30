import express from 'express'
import { VerifyAdmin, VerifyToken, VerifyUser } from '../Utils/verifyToken.js';
import { DeleteProduct, createProduct, getallProducts, getcategoryProducts, singleProduct, updateProduct } from '../Controllers/ProductController.js';


const router = express.Router();
router.use(VerifyToken)
router.post("/createproduct/:userId",VerifyUser, VerifyAdmin, createProduct)
router.put("/updateproduct/:postId", VerifyUser, VerifyAdmin, updateProduct)
router.delete("/deleteproduct/:postId", VerifyUser, VerifyAdmin, DeleteProduct)
router.get("/getcategoryproducts", getcategoryProducts)
router.get("/singleproduct/:postId", VerifyUser, singleProduct)
router.get("/getallProducts", getallProducts)


// router.post("/createproduct/:userId", createProduct)
// router.put("/updateproduct/:postId", VerifyUser, VerifyAdmin, updateProduct)
// router.delete("/deleteproduct/:postId", VerifyUser, VerifyAdmin, DeleteProduct)
// router.get("/getcategoryproducts", getcategoryProducts)
// router.get("/singleproduct/:postId", VerifyUser, singleProduct)
// router.get("/getallProducts", getallProducts)


export default router