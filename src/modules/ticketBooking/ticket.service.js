// src/modules/ticketBooking/ticket.service.js
import { db } from "../../common/config/db.js";
import { seats } from "../../common/config/schema.js";
import { eq } from "drizzle-orm";
import ApiError from "../../common/utils/api-error.js";


const getAllSeatsService = async () => {
  const result = await db.select().from(seats);
  return result;
};


const bookSeatServiceOld = async (id, name) => {
  
    return await db.transaction(async (tx) => {
    // Step 1: lock the row (FOR UPDATE)
    const result = await tx
      .select()
      .from(seats)
      .where(eq(seats.id, id))
      .for("update");

    // Step 2: check availability
    if (result.length === 0) {
      throw new Error("Seat not found");
    }

    if (result[0].isbooked === 1) {
      throw new Error("Seat already booked");
    }

    // Step 3: update seat
    const updated = await tx
      .update(seats)
      .set({ isbooked: 1, name })
      .where(eq(seats.id, id))
      .returning();

    return updated;
  });
};

const bookSeatService = async (id, name) => {
  const client = await pool.connect();

  try {
    // BEGIN transaction
    await client.query("BEGIN");

    // Step 1: lock row
    const selectQuery = `
      SELECT * FROM seats 
      WHERE id = $1 
      FOR UPDATE
    `;
    const result = await client.query(selectQuery, [id]);

    // Step 2: check availability
    if (result.rowCount === 0) {
      throw new Error("Seat not found");
    }

    if (result.rows[0].isbooked === 1) {
      throw new Error("Seat already booked");
    }

    // Step 3: update seat
    const updateQuery = `
      UPDATE seats 
      SET isbooked = 1, name = $2 
      WHERE id = $1 
      RETURNING *
    `;
    const updated = await client.query(updateQuery, [id, name]);

    // COMMIT
    await client.query("COMMIT");

    return updated.rows;

  } catch (error) {
    // ROLLBACK on error
    await client.query("ROLLBACK");
    throw error;

  } finally {
    // ALWAYS release connection
    client.release();
  }
};

export {
    getAllSeatsService,
    bookSeatService
}