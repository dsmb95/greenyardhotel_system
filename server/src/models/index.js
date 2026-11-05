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
// Rooms (the actual hotel rooms)
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

  async create ({ room_number, type, room_status = "Clean", room_comment = null }) {
    await pool.query(
        "UPDATE rooms SET room_status = ?, room_comment = ? WHERE room_number = ?",
        [room_status, room_comment ?? null, room_number]
    );
    return this.find(room_number);
  },
};
