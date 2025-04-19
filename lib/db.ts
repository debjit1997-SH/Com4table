import mongoose from "mongoose"
import postgres from "postgres"

// MongoDB connection
const dbConnect = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("Already connected to MongoDB.")
      return
    }

    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables")
    }

    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected to MongoDB successfully!")
  } catch (error) {
    console.error("Error connecting to MongoDB:", error)
    throw error
  }
}

// PostgreSQL connection
const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_Yx8CpBXVeua6@ep-fancy-voice-a50uuh4r-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"

// Create a postgres client
const sql = postgres(connectionString, {
  ssl: true,
  max: 10, // Max number of connections
  idle_timeout: 30, // Idle connection timeout in seconds
  connect_timeout: 30, // Connect timeout in seconds
})

// Test the connection
sql`SELECT NOW()`
  .then((result) => {
    console.log("PostgreSQL connected successfully at:", result[0].now)
  })
  .catch((err) => {
    console.error("PostgreSQL connection error:", err)
  })

// Export the query method for PostgreSQL
export const query = async (text: string, params: any[] = []) => {
  try {
    const start = Date.now()

    // Convert the SQL string and params to a tagged template literal
    // This is a simple implementation and might not work for all SQL queries
    let result

    if (params.length === 0) {
      // If no params, just execute the query directly
      result = await sql.unsafe(text)
    } else {
      // If there are params, replace placeholders with values
      // This is a simplified approach - the postgres library normally uses tagged templates
      const queryWithParams = sql.unsafe(text, params)
      result = await queryWithParams
    }

    const duration = Date.now() - start
    console.log("Executed query", { text, duration, rows: result.length })

    // Format the result to match the pg interface
    return {
      rows: result,
      rowCount: result.length,
      command: text.split(" ")[0].toUpperCase(),
    }
  } catch (error) {
    console.error("Error executing query:", error)
    throw error
  }
}

// Export the sql client for direct use
export const getSql = () => sql

// Export the MongoDB connection function as default
export default dbConnect
