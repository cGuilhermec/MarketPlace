import { Router } from "express";

import { createUser, deleteOneUser, deleteUsers, getAllUsers } from "./controller/UserController";
import { createAccess, getAllAccesses } from "./controller/AccessController";
import { createSotre, findManyStore } from "./controller/StoreController";
import { createProduct, deleteProduct, findManyProduct } from "./controller/ProductController";


export const router = Router();

//User
router.post("/user", createUser);
router.get("/all-users", getAllUsers);
router.delete("/dele-users", deleteUsers);
router.delete("/dele-one-user", deleteOneUser);

//Access
router.post("/access", createAccess);
router.get("/accesses", getAllAccesses);

//Store
router.post("/store/:userId", createSotre);
router.get("/store", findManyStore);


//Product
router.post("/product/:storeId", createProduct);
router.get("/products", findManyProduct);
router.delete("/delete-product/:id", deleteProduct);