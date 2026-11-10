import { pool } from "../config/db.js";

// -------------------------------------------------------------------
// Users (log user in , return a list of users and register a user)
// -------------------------------------------------------------------
export const User = {
  async findByUsername(username) {
    const [rows] = await pool.query(
      "SELECT username, full_name, password FROM users WHERE username = ?",
      [username],
    );
    return rows;
  },

  async all() {
    const [rows] = await pool.query("SELECT username, full_name FROM users");
    return rows;
  },

  async create({ username, full_name, password }) {
    await pool.query(
      "INSERT INTO users (username, full_name, password) VALUES (?, ?, ?)",
      [username, full_name, password],
    );
    return { username, full_name };
  },
};

// -------------------------------------------------------------------
// Guests
// -------------------------------------------------------------------
export const Guest = {
  async all() {
    const [rows] = await pool.query("SELECT * FROM guets ORDER BY id");
    return rows;
  },

  async find(id) {
    const [rows] = await pool.query("SELECT * FROM guests where id = ?", [id]);
    return rows[0] || null;
  },

  async create({ name, birthday, address }) {
    const [res] = await pool.query(
      "INSERT INTO guests (name, birthday, address) VALUES (?, ?, ?)",
      [name, birthday, address],
    );
  },

  async update(id, { name, birthday, address }) {
    await pool.query(
      "UPDATE guests SET name = ?, birthday = ?, address = ? WHERE id = ?",
      [name, birthday, address, id],
    );
    return this.find(id);
  },

  async remove(id) {
    await pool.query("DELETE FROM guests WHERE id = ?", [id]);
  },
};

// -------------------------------------------------------------------
// Room Types
// -------------------------------------------------------------------
export const RoomType = {
  async all() {
    const [rows] = await pool.query("SELECT * FROM room_type ORDER BY type");
    return rows;
  },

  async find(type) {
    const [rows] = await pool.query("SELECT * FROM room_type WHERE type = ?", [
      type,
    ]);
    return rows;
  },

  async create({ type, price }) {
    await pool.query("INSERT INTO room_type (type, price) VALUES (?, ?)", [
      type,
      price,
    ]);
    return this.find(type);
  },

  async update(type, price) {
    await pool.query("UPDATE room_type SET price = ? WHERE type = ?", [
      price,
      type,
    ]);
    return this.find(type);
  },

  async remove(type) {
    await pool.query("DELETE FROM room_type WHERE type = ?", [type]);
  },
};

// -------------------------------------------------------------------
// Rooms (each room in the hotel)
// -------------------------------------------------------------------
export const Room = {
  async all() {
    const [rows] = await pool.query(
      `SELECT r.room_number, r.type, r.room_status,
            r.room_comment, rt.price
     FROM rooms r
     JOIN room_type rt ON rt.type = r.type
     ORDER BY r.room_number`,
    );
    return rows;
  },

  async find(roomNumber) {
    const [rows] = await pool.query(
        `SELECT r.room_number, r.type, r.room_status, r.room_comment, rt.price
        FROM rooms r
        JOIN room_type rt ON rt.type = r.type
        WHERE r.room_number = ?`,
        [roomNumber]
    );
    return rows[0] || null;
  },

  async create ({ room_number, type, room_status = "Clean", rom_comment = null }) {
    await pool.query(
        "INSERT INTO rooms (room_number, type, room_status, room_comment) VALUES ( ?, ?, ?, ?)",
        [room_number, type, room_status, room_comment]
    );
    return this.find(room_number);
  },

  async updateStatus(room_number, room_status, room_comment) {
    await pool.query(
        "UPDATE rooms SET room_status = ?, room_comment = ? WHERE room_number = ?",
        [room_status, room_comment ?? null, room_number]
    );
    return this.find(room_number);
  },

  async remove(room_number) {
    await pool.query("DELETE FROM rooms WHERE room_number = ?", [room_number]);
  },
};

// -------------------------------------------------------------------
// Coupons
// -------------------------------------------------------------------
export const Coupon = {
    async all() {
        const [rows] = await pool.query("SELECT * FROM payment_type");
        return [rows];
    },
};

// -------------------------------------------------------------------
// Payment Types
// -------------------------------------------------------------------
export const PaymentType = {
    async all() {
        const [rows] = await pool.query("SELECT * FROM payment_type");
        return rows;
    }
};

// -------------------------------------------------------------------
// Addon Types
// -------------------------------------------------------------------
export const AddonType = {
    async all() {
        const [rows] = await pool.query("SELECT * FROM transaction_addons_types ORDER BY id");
        return rows;
    },
};

// -------------------------------------------------------------------
// Transactions
// -------------------------------------------------------------------
export const Transaction = {
    async all() {
        const [rows] = await pool.query(
            `SELECT t.*, g.name AS guest_name, r.type = AS room_type, rt.price AS room_price, u.full_name AS front_desk_name
            FROM transaction_table t
            JOIN guests g ON g.id = t.guest_id
            JOIN rooms r ON r.room_number = t.room_number
            JOIN room_type rt ON rt.type = r.type
            JOIN users u ON u.username = t.front_desk_user
            ORDER BY t.id`
        );
        return rows;
    },

    async find(id) {
        const [rows] = await pool.query(
            `SELECT t.*, g.name AS guest_name, g.birthday, g.address,
                    r.type AS room_type, rt.price AS room_price,
                    u.full_name AS front_desk_name
            FROM transactions_table t
            JOIN guests g ON g.id = t.guest_id
            JOIN rooms r ON r.room_number = t.room_number
            JOIN room_type rt ON  rt.type = r.type
            JOIN users u ON u.username = t.front_desk_user
            WHERE t.id = ?`,
            [id]
        );
        const tx = rows[0];
        if (!tx) return null;

        const [pax] = await pool.query(
            "SELECT id, gender, nationality FROM pax_transaction WHERE transaction_id = ?",
            [id]
        );

        const [addons] = await pool.query(
            `SELECT a.id, aty.id AS addon_type_id, aty.name, aty.price
                FROM transaction_addons a
                JOIN transaction_addons_types aty ON aty.id = a.addon_type_id
            WHERE a.transaction_id = ?`,
            [id]
        );

        const [payments] = await pool.query(
            `SELECT p.id, p.amount, p.paid_at, pt.type AS payment_type
                FROM payment p
                JOIN payment_type pt ON pt.id = p.payment_type_id
            WHERE p.transaction_id = ?`,
            [id]
        );
        return { ...tx, pax, addons, payments };
    },

    async create({
        guest_id,
        pax = 1,
        check_in,
        check_out,
        room_number,
        coupon_type = null,
        settlement = 0,
        front_desk_user,
        paxList = [],
        addonIds = [],
        payment = null,
    }) {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            const [res] = await conn.query(
                `INSERT INTO transaction_table
                (guest_id, pax, check_in, check_out, room_number, coupon_type, settlement, front_desk_user)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [guest_id, pax, check_in, check_out, room_number, coupon_type, settlement, front_desk_user]
            );
            const txId = res.insertId;

            for (const p of paxList) {
                await conn.query(
                    "INSERT INTO pax_transaction(transaction_id, gender, nationality) VALUES (?, ?, ?)",
                    [txId, p.gender, p.nationality]
                );
            }

            for (const addonId of addonIds) {
                await conn.query(
                    "INSERT INTO payment (transaction_id, payment_type_id) VALUES (?, ?)",
                    [txId, addonId]
                );
            }

            if (payment) {
                await conn.query(
                    "INSERT INTO payment (transaction_id, payment_type_id, amount) VALUES (?, ?, ?)",
                    [txId, payment.payment_type_id, payment.amount]
                );
            }

            await conn.query(
                "UPDATE rooms SET room_status = 'Occupied' WHERE room_number = ?",
                [room_number]
            );

            await conn.commit();
            return this.find(txId);
        } catch(err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    },

    async remove(id) {
        await pool.query("DELETE FROM transaction_table WHERE id = ?", [id]);
    },
};

// -------------------------------------------------------------------
// Historical
// -------------------------------------------------------------------
export const Historical = {
    async all() {
        const [rows] = await pool.query(
            `SELECT h.id, g.name AS guest_name, h.room_number, h.date
            FROM historical h
            LEFT JOIN guests g ON g.id = h.guest_id
            ORDER BY h.date DESC`
        );
        return rows;
    },
};

export const Dashboard = {
    async stats() {
        const [[roomsByStatus]] = await pool.query(
            `SELECT
            SUM(room_status = 'Clean') AS clean,
            SUM(room_status = 'Occupied') AS occupied,
            SUM(room_status = 'Under Maintenance') AS maintenance,
            SUM(room_status = 'Dirty') AS dirty,
            COUNT (*) AS total
            FROM rooms`
        );

        const [[txStats]] = await pool.query(
            `SELECT COUNT(*) AS total_transactions,
                COALESCE(SUM(settlement), 0) AS total_settlement
            FROM transaction_table`
        );

        const [[revenue]] = await pool.query(
            "SELECT COALESCE(SUM(amount), 0) AS revenue FROM payment"
        );

        return { roomsByStatus, ...txStats, revenue: revenue.revenue };
    },
};