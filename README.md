# Buarada.app WhatsApp Bot

This project is a WhatsApp bot for Buarada.app, designed to connect people with local events. It allows users to learn about the app, submit events, and contact the team.

## Features (Current & Planned)

*   User Identification Flow (Welcome menu)
*   FAQ section ("Learn about the app")
*   Event Submission Form (multi-step, temporary JSON storage)
*   Contact Form (multi-step, temporary JSON storage)
*   Admin Email Notifications for new events and contact requests (using Nodemailer with Ethereal fallback)
*   Event Editing/Cancellation (stubbed, command recognized)
*   Backend data storage (MongoDB integration planned for `server.js`, not yet fully used by bot)

## Prerequisites

*   Node.js (v16 or later recommended)
*   npm
*   A WhatsApp account
*   (Optional for local email testing) SMTP credentials or an Ethereal.email account.
*   (Optional for local/cloud persistence) MongoDB server or a MongoDB Atlas account.

## Project Structure

*   `bot/`: Contains the main WhatsApp bot logic (`index.js`, `faq.js`).
*   `db/`: Database related files (`connection.js` - currently for `server.js`).
*   `routes/`: API routes for the Express server (`events.js` - currently placeholder).
*   `utils/`: Utility scripts (e.g., `notifications.js`).
*   `server.js`: The main Express backend server file (minimal, for future API/dashboard).
*   `temp_events.json`: Temporary storage for event submissions (will be replaced by DB).
*   `temp_contact_requests.json`: Temporary storage for contact requests (will be replaced by DB).
*   `.gitignore`: Specifies intentionally untracked files (e.g., `node_modules/`, `.env`).
*   `package.json`, `package-lock.json`: Node.js project metadata and dependencies.
*   `README.md`: This file.
*   `Procfile` (Optional, for deployment): Example Procfile content provided in Deployment section.

## Getting Started (Bot - Local Development)

1.  **Clone the repository (if applicable) or download the files.**
2.  **Create a `.env` file:**
    In the project root, create a `.env` file to store your environment variables. You can copy `.env.example` if it exists, or create it manually.
    Example `.env` content:
    ```env
    # Your email for receiving notifications from the bot
    ADMIN_EMAIL=your_admin_email@example.com

    # Optional: SMTP credentials for sending real emails
    # If these are commented out or not provided, Nodemailer will use Ethereal.email for testing
    # SMTP_HOST=smtp.example.com
    # SMTP_PORT=587
    # SMTP_SECURE=false # true for port 465, false for others
    # SMTP_USER=your_smtp_username
    # SMTP_PASS=your_smtp_password

    # Optional: MongoDB connection string for local or cloud database
    # MONGO_URI=mongodb://localhost:27017/whatsapp_bot_db
    # MONGO_URI=mongodb+srv://<username>:<password>@yourcluster.mongodb.net/whatsapp_bot_db
    ```
    *Note: The bot currently uses JSON files (`temp_events.json`, `temp_contact_requests.json`) for data storage. MongoDB setup is primarily for the `server.js` part, which is not yet fully integrated with the bot's direct operations.*

3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Run the bot:**
    ```bash
    node bot/index.js
    ```
    On the first run, a QR code will appear in your terminal. Scan this QR code with your WhatsApp application (Linked Devices -> Link a device) to connect the bot. Once connected, the terminal will show "Client is ready!".

5.  **(Separately, if developing the server/API features) Run the Express server:**
    ```bash
    node server.js
    ```
    This will start the Express server, typically on port 3000 (or the port specified in the `PORT` environment variable). The server part is currently minimal and not directly consumed by the bot.

## Environment Variables

The application uses the following environment variables. For local development, these should be placed in a `.env` file in the project root. For deployment, these need to be set in your hosting platform's environment variable settings.

*   `ADMIN_EMAIL`: Your email address for receiving notifications about new events and contact requests. (Default: `admin@example.com` if not set, used by `utils/notifications.js`)
*   `SMTP_HOST`: Hostname of your SMTP server.
*   `SMTP_PORT`: Port of your SMTP server (e.g., 587 for TLS, 465 for SSL).
*   `SMTP_SECURE`: Set to `true` if using SSL (typically for port 465), `false` otherwise.
*   `SMTP_USER`: Username for SMTP authentication.
*   `SMTP_PASS`: Password for SMTP authentication.
    *If `SMTP_*` variables are not provided, `nodemailer` will automatically use a test account on Ethereal.email, and a preview link for sent emails will be logged to the console.*
*   `MONGO_URI`: Your MongoDB connection string. (Default: `mongodb://localhost:27017/whatsapp_bot_db` in `db/connection.js`, primarily for `server.js`)
*   `PORT`: The port for the Express web server (`server.js`) to listen on. (Default: 3000 if not set by the platform)

## Deployment

This application can be deployed to various platforms. Below are general instructions for services like Render or Railway.

### 1. Create a `Procfile`
Create a file named `Procfile` (no extension) in the root of your project. This file tells the deployment platform how to run your application.

If you intend to run both the WhatsApp bot and the Express server (for potential future API use or dashboard) in the same dyno/service (not always recommended for larger apps but okay for this scale):

```
worker: node bot/index.js
web: node server.js
```
*Note: Running two process types (web and worker) might require specific configurations or separate services on some platforms. For simplicity, you might start by deploying only the `worker` for the bot, or only the `web` if you later build out the dashboard and API significantly.*

For just the bot:
```
worker: node bot/index.js
```

### 2. Platform Setup (General for Render/Railway)

*   **Connect your Git Repository:** Link your GitHub/GitLab repository to Render or Railway.
*   **Build Command:** The platform will likely detect it's a Node.js app. The typical build command is `npm install` or `yarn install`.
*   **Start Command:** This will be taken from your `Procfile` (e.g., `node bot/index.js` for the worker or `node server.js` for the web process).
*   **Environment Variables:** This is crucial. You need to set up the environment variables listed in the "Environment Variables" section above in your deployment service's dashboard.

### 3. Setting up Persistence (MongoDB)

For data persistence (primarily for the `server.js` part, as the bot currently uses JSON files), you'll need a MongoDB database.

*   **MongoDB Atlas (Recommended for Cloud):**
    1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
    2.  Create a new cluster (the free tier `M0` is sufficient for this project).
    3.  In your cluster settings, go to "Database Access" and create a database user with a username and password. Remember these credentials.
    4.  Go to "Network Access" and add your application's IP address to the IP whitelist. For cloud platforms, you might need to allow access from anywhere (`0.0.0.0/0`), but be aware of the security implications. For Render/Railway, check their documentation for specific IP ranges or if they provide a way to connect to DBs in a private network.
    5.  Go to "Databases", click "Connect" for your cluster, choose "Connect your application", and select "Node.js" as the driver. Copy the connection string.
    6.  Replace `<username>`, `<password>`, and your database name (e.g., `whatsapp_bot_db`) in the connection string with your database user's credentials and your desired database name.
    7.  Set this full connection string as the `MONGO_URI` environment variable in your deployment platform.

*   **Local MongoDB (for local development):**
    1.  Install MongoDB Community Server on your local machine.
    2.  Ensure your MongoDB server is running.
    3.  The default `MONGO_URI` in `db/connection.js` (`mongodb://localhost:27017/whatsapp_bot_db`) should work. You can also set this via an `.env` file for consistency.

## Running Locally (Reiteration with .env)

1.  Clone repository.
2.  Create a `.env` file in the project root (see "Getting Started" for example content).
3.  Install dependencies: `npm install`
4.  Run the bot: `node bot/index.js`
5.  (Separately, if needed for API/dashboard development) Run the server: `node server.js` (will listen on port 3000 by default unless `PORT` env var is set).

---
*This README provides a comprehensive guide to setting up, running, and deploying the Buarada.app WhatsApp Bot.*
