// Database configuration
export const dbConfig = {
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://neondb_owner:npg_Yx8CpBXVeua6@ep-fancy-voice-a50uuh4r-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require",
  ssl: {
    rejectUnauthorized: false,
  },
}
