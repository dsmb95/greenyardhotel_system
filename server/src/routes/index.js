import { Router } from "express";
import { authRequired } from "../config/auth.js";
import * as auth from "../controllers/authController.js";
import * as api from "../controllers/apiController.js";

const router = Router();

// -------------------------------------------------------------------
// Auth
// -------------------------------------------------------------------
router.post("/auth/login", auth.login);
router.get("/auth/me", authRequired, auth.me);

// -------------------------------------------------------------------
// Guests
// -------------------------------------------------------------------
router.get("/guests", authRequired, api.listGuests);
router.get("/guests/:id", authRequired, api.getGuest);
router.post("/guests", authRequired, api.createGuest);
router.put("/guests/:id", authRequired, api.updateGuest);
router.delete("/guests/:id", authRequired, api.deleteGuest);

// -------------------------------------------------------------------
// Rooms
// -------------------------------------------------------------------
router.get("/rooms", authRequired, api.listRooms);
router.get("/rooms/:roomNumber", authRequired, api.getRoom);
router.post("/rooms", authRequired, api.createRoom);
router.put("/rooms/:roomNumber", authRequired, api.updateRoomStatus);
router.delete("/rooms/:roomNumber", authRequired, api.deleteRoom);

// -------------------------------------------------------------------
// Room types
// -------------------------------------------------------------------
router.get("/room-types", authRequired, api.listRoomTypes)
router.post("/room-types", authRequired, api.createRoomType);
router.put("/room-types/:type", authRequired, api.updateRoomType);
router.delete("/room-types/:type", authRequired, api.deleteRoomType);

// -------------------------------------------------------------------
// Coupons / Payment Types/ Addons
// -------------------------------------------------------------------
router.get("/coupons", authRequired, api.listCoupons);
router.get("/payment-types", authRequired, api.listPaymentTypes);
router.get("/addon-types", authRequired, api.listAddonTypes);

// -------------------------------------------------------------------
// Historical
// -------------------------------------------------------------------
router.get("/historical", authRequired, api.listHistorical);

// -------------------------------------------------------------------
// Dashboard
// -------------------------------------------------------------------
router.get("/dashboard/stats", authRequired, api.dashboardStats);

// -------------------------------------------------------------------
// Users
// -------------------------------------------------------------------
router.get("/users", authRequired, auth.listUsers);

export default router;