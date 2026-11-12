import { Guest, Room, RoomType, Coupon, PaymentType, AddonType, Transaction, Historical, Dashboard } from "../models/index.js";

// --------------------------------------------------------------
// Guests
// --------------------------------------------------------------
export const listGuests = async (req, res) => res.json({ guests: await Guest.all() });

export const getGuest = async (req, res) => {
    const g = await Guest.find(req.params.id);
    return g ? res.json(g) : res.status(404).json({ error: "Guest not found" });
};

export const createGuest = async (req, res) => {
    const g = await Guest.create(req.body);
    res.status(201).json(g);
};

export const updateGuest = async (req, res) => {
    const g = await Guest.update(req.params.id, req.body);
    return g ? res.json(g) : res.status(404).json({ error: "Guest not found" });
};

export const deleteGuest = async (req, res) => {
    const g = await Guest.remove(req.params.id);
    res.status(204).end();
};

// --------------------------------------------------------------
// Rooms
// --------------------------------------------------------------
export const listRooms = async (req, res) => res.json({ rooms: await Room.all() });

export const getRoom = async (req, res) => {
    const r = await Room.find(req.params.roomNumber);
    return r ? res.json(r) : res.status(404).json({ error: "Room not found" });
};

export const createRoom = async (req, res) => {
    const r = await Room.create(req.body);
    res.status(201).json(r);
};

export const updateRoomStatus = async (req, res) => {
    const { room_status, room_comment} = req.body;
    const r = await Room.updateStatus(req.params.roomNumber, room_status, room_comment);
    return r ? res.json(r) : res.status(404).json({ error: "Room not found" });
};

export const deleteRoom = async (req, res) => {
    await Room.remove(req.params.type);
    res.status(204).end();
}

// --------------------------------------------------------------
// Coupons / Payment Types / Addons
// --------------------------------------------------------------
export const listCoupons = async (req, res) => req.json({ coupons: await Coupon.all() });

export const listPaymentTypes = async (req, res) => res.json({ paymentTypes: await PaymentType.all() });

export const listAddonTypes = async (req, res) => res.json({ addonTypes: await AddonType.all() });

// --------------------------------------------------------------
// Transactions
// --------------------------------------------------------------

export const listTransactions = async (req, res) => res.json({ transactions: await Transaction.all() });

export const getTransaction = async (req, res) => {
    const t = await Transaction.find(req.params.id);
    return t ? res.json(t) : res.status(404).json({ error: "Transaction not found" });
};

export const createTransaction = async (req, res) => {
    try {
        const t = await Transaction.create(req.body);
        res.status(201).json(t);
    } catch(err) {
        res.status(404).json({ error: err.message });
    }
};

// --------------------------------------------------------------
// Historical
// --------------------------------------------------------------
export const listHistorical = async (req, res) => res.json({ historical: await Historical.all() });

// --------------------------------------------------------------
// Dashboard
// --------------------------------------------------------------
export const dashboardStats = async (req, res) => res.json(await Dashboard.stats());