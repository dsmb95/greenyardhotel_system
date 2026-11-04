SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS payment;
DROP TABLE IF EXISTS transaction_addons;
DROP TABLE IF EXISTS pax_transaction;
DROP TABLE IF EXISTS transaction_table;
DROP TABLE IF EXISTS historical;
DROP TABLE IF EXISTS guests;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS room_type;
DROP TABLE IF EXISTS coupon;
DROP TABLE IF EXISTS payment_type;
DROP TABLE IF EXISTS transaction_addons_types;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

----------------------------------------------------------------
-- Users (front desk staff & admin / login)
----------------------------------------------------------------
CREATE TALBE users (
    username VARCHAR(50) PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

----------------------------------------------------------------
-- Room Type (room types and their corresponding prices)
----------------------------------------------------------------
CREATE TABLE room_type (
    type VARCHAR(40) PRIMARY KEY,
    price DECIMAL(10,2) NOT NULL
);

----------------------------------------------------------------
-- Rooms (actual rooms in the hotel)
----------------------------------------------------------------
CREATE TABLE rooms (
    room_number INT PRIMARY KEY,
    type VARCHAR(40) NOT NULL,
    room_status ENUM('Clean', 'Occupied', 'Under Maintenance', 'Dirty') DEFAULT 'Clean',
    room_comment VARCHAR(255),
    FOREIGN KEY (type) REFERENCES room_type(type) -- reference to room_type table
);

----------------------------------------------------------------
-- Guests (hotel guests profile and details)
----------------------------------------------------------------
CREATE TABLE guests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    birthday DATE,
    address VARCHAR(255)
);

----------------------------------------------------------------
-- Coupon (discounts available)
----------------------------------------------------------------
CREATE TABLE coupon (
    type VARCHAR(60) PRIMARY KEY,
    discount_percent DECIMAL(5,2) NOT NULL
);

----------------------------------------------------------------
-- Transaction Addons Types (extra charges)
----------------------------------------------------------------
CREATE TABLE transaction_addons_types (
    name VARCHAR(60) PRIMARY KEY,
    price DECIMAL(10,2) NOT NULL
);

----------------------------------------------------------------
-- Transactions (guest bookings)
----------------------------------------------------------------
CREATE TABLE transaction_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    guest_id INT NOT NULL,
    pax INT DEFAULT 1,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    room_number INT NOT NULL,
    coupon_type VARCHAR(60),
    settlement DECIMAL(10,2) DEFAULT 0,
    front_desk_user VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (guest_id) REFERENCES guests(id),
    FOREIGN KEY (room_number) REFERENCES rooms(room_number),
    FOREIGN KEY (coupon_type) REFERENCES coupon(type),
    FOREIGN KEY (front_desk_user) REFERENCES users(username)
);

----------------------------------------------------------------
-- Pax Transaction (each guest that will stay in the room)
----------------------------------------------------------------
CREATE TABLE pax_transaction (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT NOT NULL,
    gender ENUM ('Male', 'Female', 'Other') NOT NULL,
    nationality VARCHAR(60) NOT NULL,
    FOREIGN KEY (transaction_id) REFERENCES transaction_table(id) ON DELETE CASCADE,
);

----------------------------------------------------------------
-- Transaction Addons (links transactions to addons)
----------------------------------------------------------------
CREATE TABLE transaction_addons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT NOT NULL,
    addon_name VARCHAR(60) NOT NULL,
    FOREIGN KEY (transactions_id) REFERENCES transaction_table(id) ON DELETE CASCADE,
    FOREIGN KEY (addon_name) REFERENCES transaction_addons_types(name)
);

----------------------------------------------------------------
-- Payment
----------------------------------------------------------------
CREATE TABLE payment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT NOT NULL,
    payment_type ENUM ('Cash', 'Card', 'E-Transfer', 'Cheque'),
    amount DECIMAL (10,2) NOT NULL,
    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_id) REFERENCES transaction_table(id) ON DELETE CASCADE,
);

----------------------------------------------------------------
-- Historical room log (audit / history of occupancy)
----------------------------------------------------------------
CREATE TABLE historical (
    id INT AUTO_INCREMENT PRIMARY KEY,
    guest_id INT NOT NULL,
    room_number INT NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (guest_id) REFERENCES guests(id),
    FOREIGN KEY (room_number) REFERENCES rooms(room_number)
);