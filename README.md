# StoreBill - Billing Software

A complete billing solution for retail stores. Manage inventory, create invoices, track sales, and more.

## MongoDB Atlas Setup

### 1. Create a MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. Create a new project.

### 2. Create a Cluster

1. Click "Build a Database" and select the free tier option.
2. Choose your preferred cloud provider and region.
3. Click "Create Cluster" and wait for the cluster to be created (this may take a few minutes).

### 3. Set Up Database Access

1. In the left sidebar, click "Database Access" under Security.
2. Click "Add New Database User".
3. Create a username and password. Make sure to save these credentials.
4. Set privileges to "Read and Write to Any Database" and click "Add User".

### 4. Set Up Network Access

1. In the left sidebar, click "Network Access" under Security.
2. Click "Add IP Address".
3. For development, you can click "Allow Access from Anywhere" or add your specific IP address.
4. Click "Confirm".

### 5. Get Connection String

1. Go back to your cluster and click "Connect".
2. Select "Connect your application".
3. Copy the connection string.
4. Replace `<username>` and `<password>` with your database user credentials.

### 6. Configure Environment Variables

1. Create a `.env.local` file in the root of your project.
2. Add the following environment variables:

