import * as fs from "fs";
import { sql } from "@vercel/postgres";

const countries = JSON.parse(fs.readFileSync("countries.json", "utf-8"));

export async function populateCountryTable() {
  // Create table if it doesn't exist
  await sql`
    CREATE TABLE IF NOT EXISTS Country (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        iso_code TEXT NOT NULL UNIQUE
    )
  `;

  // Check if the table is empty
  const result = await sql<
    { count: number }[]
  >`SELECT COUNT(*) as count FROM Country`;
  const count = result.rows[0]?.count;
  console.log(count);
  if (count == 0) {
    // Insert data into table
    for (const country of countries) {
      console.log(`Inserting ${country.name} into the database...`);

      await sql`
        INSERT INTO Country (name, iso_code)
        VALUES (${country.name}, ${country.iso2Code})
        ON CONFLICT (iso_code) DO NOTHING
      `;
    }
  }
}

populateCountryTable().catch(console.error);
