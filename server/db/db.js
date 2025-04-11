import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_URL,
});

// Test the connection
pool
  .connect()
  .then((client) => {
    console.log("✅ Connected to PostgreSQL successfully!");
    client.release(); // release connection back to the pool
  })
  .catch((err) => {
    console.error("❌ Failed to connect to PostgreSQL:", err.stack);
  });

// Export pool so it can be used in other files
export default {
  query: (text, params) => pool.query(text, params),
};

// // Test the database connection
// const testConnection = async () => {
//     try {
//       const client = await pool.connect();
//       console.log('✅ Connected to PostgreSQL successfully!');
//       client.release();
//     } catch (err) {
//       console.error('❌ Failed to connect to PostgreSQL:', err.stack);
//     }
//   };

//   await testConnection(); // Can be called at top level in ESM (Node 14+ with "type": "module")

//   // Export the query method
//   const db = {
//     query: async (text, params) => {
//       try {
//         const result = await pool.query(text, params);
//         return result;
//       } catch (err) {
//         console.error('❌ Query error:', err.stack);
//         throw err;
//       }
//     },
//   };

//   export default db;
