# BAPS Sarsa Yuvak Management System

A comprehensive web application designed to manage attendance, prasangs (spiritual experiences), and events for BAPS Sarsa Yuvaks. This system replaces manual processes with a streamlined digital platform for both Yuvaks and Administrators.

## Features

### For Yuvaks
- **QR Code Attendance:** Instantly mark attendance for sabhas by scanning a QR code with the built-in camera scanner.
- **Attendance Fallback:** If the camera fails, Yuvaks can manually request attendance marking from admins.
- **Prasangs Feed:** Read approved spiritual experiences (Prasangs) shared by other Yuvaks.
- **Submit Prasangs:** Share your own spiritual experiences for admin review.
- **Real-time Notifications:** Receive instant notifications when your submitted Prasang is approved or rejected (with admin notes).
- **Attendance History:** View a complete history of your past attendances.
- **Secure Authentication:** OTP-based password resets and secure credential management.

### For Administrators
- **Dashboard Overview:** Monitor key metrics like daily attendance, total Yuvaks, and pending Prasangs.
- **Manage Yuvaks:** Add new Yuvaks, edit their details, or bulk-upload Yuvak data via Excel sheets.
- **Attendance Terminal:** Generate dynamic QR codes for Yuvaks to scan, or manually mark attendance via an admin terminal.
- **Review Prasangs:** Approve or reject submitted Prasangs with optional admin notes.
- **Manage Events:** Create and schedule upcoming sabhas and events.
- **Reports Generation:** Download comprehensive attendance reports in Excel and PDF formats for any given date.

## Technology Stack

### Frontend
- **React.js (Vite):** Fast and modern UI framework.
- **Tailwind CSS:** For custom, highly responsive, and beautiful styling following BAPS design guidelines.
- **Lucide React:** Minimalist iconography.
- **Html5-Qrcode:** Robust library for scanning QR codes directly from the browser with custom overlays.
- **jspdf & xlsx:** For generating PDF and Excel reports client-side.

### Backend
- **Node.js & Express.js:** Scalable and lightweight backend architecture.
- **Supabase (PostgreSQL):** Robust relational database management system.
- **JWT & Bcrypt:** Secure authentication and password hashing.
- **Render:** Fast backend deployment platform.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- A Supabase account and database instance

### Environment Variables
For security reasons, `.env` files are ignored by git. You must create your own `.env` files based on the examples below.

**Backend (`backend/.env`):**
```env
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_or_service_key
JWT_SECRET=your_secure_jwt_secret
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
```

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/WalnutBarrel/baps-sarsa.git
   cd baps-sarsa
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   # Create .env file here
   npm start
   ```

3. **Setup Frontend:**
   ```bash
   cd ../frontend
   npm install
   # Create .env file here
   npm run dev
   ```

4. **Database Setup:**
   Run the SQL scripts provided in `schema.sql` on your Supabase instance to create the necessary tables (`users`, `attendance_log`, `events`, `prasangs`, `activities`, `otp_sessions`).

## Deployment
- **Frontend:** Deployed on Vercel (connected to the `main` branch for automatic deployments).
- **Backend:** Deployed on Render.

## License
Proprietary software. Created for BAPS Sarsa.
