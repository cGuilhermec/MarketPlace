import { Router } from "express";

import { createUser, deleteOneUser, deleteUsers, getAllUsers, getUniqueUser } from "./controller/UserController";
import { createAccess, getAllAccesses } from "./controller/AccessController";
import { createSotre, findManyStore } from "./controller/StoreController";
import { createProduct, deleteProduct, findManyProduct } from "./controller/ProductController";
import { signIn } from "./controller/SessionsController";
import { authMiddleware } from "./middleware/AuthMiddleware";
import { createSale } from "./controller/SalerController";


export const router = Router();

//User
router.post("/user", createUser);
router.get("/all-users", authMiddleware(["adm"]), getAllUsers);
router.get("/get-unique-user", authMiddleware(["Comprador", "adm", "Vendedor"]), getUniqueUser);
router.delete("/delete-users", authMiddleware(["adm"]), deleteUsers);
router.delete("/delete-one-user", authMiddleware(["adm"]), deleteOneUser);

//Access
router.post("/access", authMiddleware(["adm"]), createAccess);
router.get("/accesses", authMiddleware(["adm"]), getAllAccesses);

//Store
router.post("/store", authMiddleware(["adm", "Vendedor"]), createSotre);
router.get("/stores", findManyStore);

//Product
router.post("/product/:storeId", authMiddleware(["adm", "Vendedor"]), createProduct);
router.get("/products", authMiddleware(["Comprador", "adm", "Vendedor"]), findManyProduct);
router.delete("/delete-product/:id", deleteProduct);

//Auth
router.post("/sign-in", signIn);

//Sale
router.post("/create-sale", authMiddleware(["Comprador", "adm", "Vendedor"]), createSale);