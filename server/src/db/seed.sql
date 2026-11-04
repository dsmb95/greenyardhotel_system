----------------------------------------------------------------
-- Sample seed data
----------------------------------------------------------------

USE greenyard

----------------------------------------------------------------
-- Users table (staff/admin)
----------------------------------------------------------------
INSERT INTO users (username, full_name, password) VALUES
('daniellemananquil', 'Danielle Samantha Mananquil', '-greenyard2018')

----------------------------------------------------------------
-- Room Types
----------------------------------------------------------------
INSERT INTO room_type (type, price) VALUES
('Twin', 1800.00),
('Queen', 2000.00),
('King', 2500.00);

----------------------------------------------------------------
-- Rooms (actual rooms in the hotel)
----------------------------------------------------------------
INSERT INTO rooms (room_number, type, room_status, room_comment) VALUES
(101, 'Twin', 'Clean', NULL),
(102, 'Twin', 'Clean', NULL),
(103, 'Twin', 'Clean', NULL),
(105, 'Twin', 'Clean', NULL),
(106, 'Twin', 'Clean', NULL),
(107, 'Twin', 'Clean', NULL),
(201, 'Twin', 'Clean', NULL),
(202, 'Twin', 'Clean', NULL),
(203, 'Twin', 'Clean', NULL),
(205, 'Twin', 'Clean', NULL),
(206, 'Twin', 'Clean', NULL),
(207, 'Twin', 'Clean', NULL),
(108, 'Queen', 'Clean', NULL),
(109, 'Queen', 'Clean', NULL),
(208, 'Queen', 'Clean', NULL),
(209, 'Queen', 'Clean', NULL),
(110, 'King', 'Clean', NULL),
(111, 'King', 'Clean', NULL),
(210, 'King', 'Clean', NULL),
(211, 'King', 'Clean', NULL);

----------------------------------------------------------------
-- Guest table
----------------------------------------------------------------
INSERT INTO guest (name, birthday, address) VALUES
('Just Buenaventura', '1995-03-25', 'Minante I', 'Cauayan City'),
('Alex Mananquil', '1997-10-25', 'District I (Pob.)', 'Cauayan City'),
('Maxine Mananquil', '2001-02-22', 'Sikatuna Village, Quezon City');

----------------------------------------------------------------
-- Coupon table
----------------------------------------------------------------
INSERT INTO coupon (type, discount_percent) VALUES
('Rainy Day', 0.15),
('Friends & Family', 0.20),
('Brownout', 0.25);

----------------------------------------------------------------
-- Addon Types
----------------------------------------------------------------
INSERT INTO transaction_addons_types (name, price) VALUES
('Smoking', 1000.00),
('Extra Bed', 500.00),
('Extra Person', 600.00);

----------------------------------------------------------------
-- Transaction table (transaction summary per guest)
----------------------------------------------------------------
INSERT INTO transaction_table (id, guest_id, pax, check_in, check_out, room_number, coupon_type, settlement, front_desk_user) VALUES
(1, 1, 2, '2026-11-03', '2026-11-05', 201, 'Friends & Family', 1800.00, 'daniellemananquil');

----------------------------------------------------------------
-- Pax transaction table (added guest to main guest transaction)
----------------------------------------------------------------
INSERT INTO pax_transaction (transaction_id, gender, nationality) VALUES
(1, 'Female', 'Filipino');

----------------------------------------------------------------
-- Transaction addons table to link to main transaction
----------------------------------------------------------------
INSERT INTO transaction_addons (transaction_id, addon_name) VALUES 
(1, 'Extra Person');

----------------------------------------------------------------
-- Payment table (links payments to main transaction table)
----------------------------------------------------------------
INSERT INTO payment (transaction_id, payment_type, amount) VALUES
(1, 'Card', 2400.00);

----------------------------------------------------------------
-- Historical (a list of all the transactions)
----------------------------------------------------------------
INSERT INTO historical (guest_id, room_number, date) VALUES
(1, 201, '2026-11-03');