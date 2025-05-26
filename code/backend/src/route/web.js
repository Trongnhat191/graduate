import express from "express";
import homeController from "../controllers/homeController.js";
import userController from "../controllers/userController.js";
import sensorController from "../controllers/sensorController.js";
import carController from "../controllers/carController.js";
import { callbackMomoPayment, createMomoPayment, rechargeBalance, callbackRechargeBalance } from "../controllers/paymentController.js";
import crypto from "crypto";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
let router = express.Router();

const ACCESSKEY = process.env.ACCESSKEY;
const SECRETKEY = process.env.SECRETKEY;

let initWebRoutes = (app) => {
  // ------------------------
  router.get("/", homeController.getHomePage);

  router.get("/crud", homeController.getCRUD);

  router.post("/post-crud", homeController.postCRUD);

  router.get("/get-crud", homeController.displayGetCRUD);

  router.get("/edit-crud", homeController.getEditCRUD);

  router.post("/put-crud", homeController.putCRUD);

  router.get("/delete-crud", homeController.deleteCRUD);
  //-------------------------

  // API
  router.get("/api/get-all-users", userController.handleGetAllUsers);
  router.post("/api/login", userController.handleLogin);
  router.post("/api/create-new-user", userController.handleCreateNewUser);
  router.put("/api/edit-user", userController.handleEditUser);
  router.delete("/api/delete-user", userController.handleDeleteUser);
  router.get("/api/get-user-info-by-id", userController.handleGetUserInfoById);

  router.post("/update", sensorController.handleUpdate);
  router.post("/manual-plate-correction", sensorController.handlemanualPlateCorrectionEntry);
  router.post("/manual-plate-correction-exit", sensorController.handlemanualPlateCorrectionExit);
  router.post("/api/create-new-car", carController.handleCreateNewCar);
  router.get("/api/get-ticket-info-by-number-plate", carController.handleGetTicketInfoByNumberPlate);

  // Momo payment month ticket
  router.post("/api/momo/payment", createMomoPayment);
  router.post("/api/momo/callback", callbackMomoPayment);

  // Momo payment recharge 
  router.post("/api/momo/recharge", rechargeBalance);
  router.post("/api/momo/callback-recharge", callbackRechargeBalance);

  // Manual payment confirm
  router.post("/api/manual-payment-confirm", sensorController.handleManualPaymentConfirm);
  return app.use("/", router);
};

export default initWebRoutes;
