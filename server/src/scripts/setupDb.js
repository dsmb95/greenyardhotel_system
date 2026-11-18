import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { rootPool } from "../config/db.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_NAME = process.env.DB_NAME || "greenyard";

async function runFile(label, file) {
  const sql = fs.readFileSync(file, "utf8");
  console.log(`\n--- ${label} ---`);
  await rootPool.query(sql);
  console.log(`Executed ${file}`);
}

async function main() {
  try {
    await rootPool.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    await rootPool.query(`USE \`${DB_NAME}\`;`);

    const dbDir = path.join(__dirname, "..", "db");
    await runFile("Schema", path.join(dbDir, "schema.sql"));

    // Create default users (admin + justin) BEFORE seed data, because the
    // seed transaction references front_desk_user = 'justin'.
    for (const [username, fullName, pass] of [
      ["admin", "Front Desk Admin", "admin123"],
      ["justin", "Justin Desk", "justin123"],
    ]) {
      const [rows] = await rootPool.query(
        `SELECT username FROM users WHERE username = ?`,
        [username]
      );
      if (rows.length === 0) {
        const hash = await bcrypt.hash(pass, 10);
        await rootPool.query(
          `INSERT INTO users (username, full_name, password) VALUES (?, ?, ?)`,
          [username, fullName, hash]
        );
        console.log(`Created default user (${username} / ${pass})`);
      }
    }

    await runFile("Seed", path.join(dbDir, "seed.sql"));

    console.log("\nDatabase setup complete.");
  } catch (err) {
    console.error("Setup failed:", err);
    process.exit(1);
  } finally {
    await rootPool.end();
  }
}

main();