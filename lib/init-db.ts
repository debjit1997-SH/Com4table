import { getSql } from "./db"

export async function initializeDatabase() {
  const sql = getSql()

  try {
    console.log("Starting database initialization...")

    // Create users table with detailed error handling
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
      console.log("Users table created or already exists")
    } catch (error) {
      console.error("Error creating users table:", error)
      throw new Error(`Failed to create users table: ${error.message}`)
    }

    // Create other tables...
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS customers (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255),
          phone VARCHAR(50),
          address TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
      console.log("Customers table created or already exists")
    } catch (error) {
      console.error("Error creating customers table:", error)
      // Continue with other tables even if this one fails
    }

    try {
      await sql`
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          price DECIMAL(10, 2) NOT NULL,
          stock INTEGER NOT NULL DEFAULT 0,
          category VARCHAR(100),
          gst INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
      console.log("Products table created or already exists")
    } catch (error) {
      console.error("Error creating products table:", error)
      // Continue with other tables even if this one fails
    }

    try {
      await sql`
        CREATE TABLE IF NOT EXISTS bills (
          id SERIAL PRIMARY KEY,
          bill_number VARCHAR(50) UNIQUE NOT NULL,
          customer_id INTEGER,
          customer_name VARCHAR(255),
          subtotal DECIMAL(10, 2) NOT NULL,
          gst_amount DECIMAL(10, 2) NOT NULL,
          discount DECIMAL(5, 2) NOT NULL DEFAULT 0,
          discount_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
          total DECIMAL(10, 2) NOT NULL,
          payment_method VARCHAR(50) NOT NULL,
          notes TEXT,
          status VARCHAR(50) NOT NULL DEFAULT 'paid',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
      console.log("Bills table created or already exists")
    } catch (error) {
      console.error("Error creating bills table:", error)
      // Continue with other tables even if this one fails
    }

    try {
      await sql`
        CREATE TABLE IF NOT EXISTS bill_items (
          id SERIAL PRIMARY KEY,
          bill_id INTEGER NOT NULL,
          product_id INTEGER,
          name VARCHAR(255) NOT NULL,
          price DECIMAL(10, 2) NOT NULL,
          quantity INTEGER NOT NULL,
          gst INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
      console.log("Bill items table created or already exists")
    } catch (error) {
      console.error("Error creating bill_items table:", error)
      // Continue with other tables even if this one fails
    }

    try {
      await sql`
        CREATE TABLE IF NOT EXISTS settings (
          id INTEGER PRIMARY KEY DEFAULT 1,
          name VARCHAR(255) NOT NULL DEFAULT 'My Store',
          address TEXT,
          phone VARCHAR(50),
          email VARCHAR(255),
          gst VARCHAR(50),
          logo TEXT,
          qr_code TEXT,
          primary_color VARCHAR(50) DEFAULT '#4F46E5',
          enable_gst BOOLEAN DEFAULT TRUE,
          split_gst BOOLEAN DEFAULT TRUE,
          enable_tcs BOOLEAN DEFAULT FALSE,
          enable_tds BOOLEAN DEFAULT FALSE,
          currency_code VARCHAR(10) DEFAULT 'INR',
          currency_name VARCHAR(50) DEFAULT 'Indian Rupee',
          currency_symbol VARCHAR(10) DEFAULT '₹',
          currency_exchange_rate DECIMAL(10, 6) DEFAULT 1,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
      console.log("Settings table created or already exists")
    } catch (error) {
      console.error("Error creating settings table:", error)
      // Continue with other tables even if this one fails
    }

    console.log("All tables created successfully")

    // Create admin user directly without checking if it exists
    try {
      // First try to create the admin user
      await sql`
        INSERT INTO users (name, email, password, role)
        VALUES ('Debjit Dey', 'debjitdey1612@gmail.com', 'amimalik12345', 'admin')
        ON CONFLICT (email) 
        DO UPDATE SET 
          name = 'Debjit Dey',
          password = 'amimalik12345',
          role = 'admin'
      `
      console.log("Admin user created or updated successfully")
    } catch (error) {
      console.error("Error creating admin user:", error)

      // If there was an error, try a different approach
      try {
        // Check if user exists
        const existingUser = await sql`SELECT * FROM users WHERE email = ${"debjitdey1612@gmail.com"}`

        if (existingUser.length === 0) {
          // Try to insert again with a simpler query
          await sql`
            INSERT INTO users (name, email, password, role)
            VALUES ('Debjit Dey', 'debjitdey1612@gmail.com', 'amimalik12345', 'admin')
          `
          console.log("Admin user created with fallback method")
        } else {
          console.log("Admin user already exists, no need to create")
        }
      } catch (secondError) {
        console.error("Failed to create admin user with fallback method:", secondError)
        throw new Error(`Failed to create admin user: ${secondError.message}`)
      }
    }

    // Create default settings
    try {
      await sql`
        INSERT INTO settings (id, name, address, phone, email, gst)
        VALUES (1, 'My Store', '123 Store Street, City', '1234567890', 'store@example.com', '22AAAAA0000A1Z5')
        ON CONFLICT (id) 
        DO UPDATE SET 
          name = 'My Store',
          address = '123 Store Street, City',
          phone = '1234567890',
          email = 'store@example.com',
          gst = '22AAAAA0000A1Z5'
      `
      console.log("Default settings created or updated")
    } catch (error) {
      console.error("Error creating default settings:", error)
      // Not critical, continue
    }

    return true
  } catch (error) {
    console.error("Database initialization failed:", error)
    return false
  }
}

// Function to create admin user directly
export async function createAdminUser() {
  const sql = getSql()

  try {
    console.log("Creating admin user directly...")

    // First check if users table exists, if not create it
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    } catch (error) {
      console.error("Error creating users table:", error)
    }

    // Try to insert the admin user with ON CONFLICT DO UPDATE
    try {
      await sql`
        INSERT INTO users (name, email, password, role)
        VALUES ('Debjit Dey', 'debjitdey1612@gmail.com', 'amimalik12345', 'admin')
        ON CONFLICT (email) 
        DO UPDATE SET 
          password = 'amimalik12345',
          role = 'admin'
      `
      return { success: true, message: "Admin user created or updated successfully" }
    } catch (error) {
      console.error("Error with upsert:", error)

      // If upsert fails, try a different approach
      try {
        // Check if user exists
        const existingUser = await sql`SELECT * FROM users WHERE email = ${"debjitdey1612@gmail.com"}`

        if (existingUser.length === 0) {
          // User doesn't exist, try to create
          await sql`
            INSERT INTO users (name, email, password, role)
            VALUES ('Debjit Dey', 'debjitdey1612@gmail.com', 'amimalik12345', 'admin')
          `
          return { success: true, message: "Admin user created successfully" }
        } else {
          // User exists, try to update
          await sql`
            UPDATE users 
            SET password = ${"amimalik12345"}, role = ${"admin"} 
            WHERE email = ${"debjitdey1612@gmail.com"}
          `
          return { success: true, message: "Admin user updated successfully" }
        }
      } catch (fallbackError) {
        console.error("Fallback approach failed:", fallbackError)
        return { success: false, message: `Failed to create admin user: ${fallbackError.message}` }
      }
    }
  } catch (error) {
    console.error("Create admin user failed:", error)
    return { success: false, message: `Error: ${error.message}` }
  }
}
