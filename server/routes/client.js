import express from "express";
import {
  getProducts,
  getCustomers,
  getTransactions,
  getGeography,
  getProperties,
  getUsers,
  updateFeatured,
  
} from "../controllers/client.js";
// import verifyToken from "../middleware/verifyToken.js";


const router = express.Router();

router.get("/products", getProducts);
router.get("/customers", getCustomers);
router.get("/transactions", getTransactions);
router.get("/geography", getGeography);
router.get("/find/", getProperties);
router.put("/updatefeatured/:id", updateFeatured);
router.get("/users/", getUsers);
router.get("/", getGeography);

export default router;
