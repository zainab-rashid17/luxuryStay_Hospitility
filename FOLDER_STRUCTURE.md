# LuxuryStay Hospitality - Folder Structure Explanation

## 📁 Project Overview
This is a **MERN Stack** (MongoDB, Express, React, Node.js) hotel management system with a **monorepo structure** containing separate `backend` and `frontend` directories.

```
LuxuryStay Hospitality/
├── backend/          # Node.js/Express API Server
├── frontend/         # React.js Frontend Application
└── package.json      # Root package.json (for running both servers)
```

---

## 🔧 Backend Structure (`/backend`)

### **Core Files**
- **`server.js`** / **`server.jsx`** - Main Express server entry point
  - Sets up Express app, middleware, routes
  - Connects to MongoDB
  - Handles file uploads (Multer)
  - Starts the server on port 5000

- **`package.json`** - Backend dependencies and scripts
  - Key dependencies: Express, Mongoose, JWT, bcryptjs, Multer, Cloudinary, Nodemailer
  - Scripts: `start`, `dev`, `create-admin`, `seed-dashboard`, etc.

---

### **📂 `/controllers`** - Business Logic Layer
Contains controller functions that handle HTTP request/response logic:

- **`authController.js`** - Authentication (login, register, Google OAuth)
- **`userController.js`** - User CRUD operations, profile management
- **`roomController.js`** - Room management (create, update, delete, get rooms)
- **`reservationController.js`** - Booking management (create, check-in, check-out)
- **`billingController.js`** - Invoice generation, payment processing
- **`serviceController.js`** - Guest service requests (room service, spa, etc.)
- **`feedbackController.js`** - Guest feedback/reviews management
- **`reportController.js`** - Analytics and reports (occupancy, revenue)
- **`settingsController.js`** - System settings management
- **`messageController.js`** - Chat/messaging functionality
- **`notificationController.js`** - Push notifications

**Note:** Some files have both `.js` and `.jsx` versions (legacy/duplicate files).

---

### **📂 `/models`** - Database Schema (Mongoose Models)
Defines MongoDB collections and their schemas:

- **`User.js`** - User schema (admin, guest roles)
- **`Room.js`** - Room schema (type, price, amenities, images)
- **`Reservation.js`** - Booking schema (dates, guest, room, status)
- **`Billing.js`** - Invoice/bill schema (charges, payments, status)
- **`ServiceRequest.js`** - Service request schema (type, status, cost)
- **`Feedback.js`** - Feedback/review schema (rating, comment, status)
- **`Gallery.js`** - Image gallery schema
- **`Notification.js`** - Notification schema
- **`Message.js`** / **`Conversation.js`** - Chat schemas
- **`SystemSettings.js`** - App configuration schema

---

### **📂 `/routes`** - API Endpoints
Defines HTTP routes and connects them to controllers:

- **`auth.js`** - `/api/auth/*` (login, register, Google OAuth)
- **`users.js`** - `/api/users/*` (CRUD operations)
- **`rooms.js`** - `/api/rooms/*` (room management)
- **`reservations.js`** - `/api/reservations/*` (bookings)
- **`billing.js`** - `/api/billing/*` (invoices, payments)
- **`services.js`** - `/api/services/*` (service requests)
- **`feedback.js`** - `/api/feedback/*` (reviews)
- **`reports.js`** - `/api/reports/*` (analytics)
- **`gallery.js`** - `/api/gallery/*` (image uploads)
- **`settings.js`** - `/api/settings/*` (system config)
- **`messages.js`** - `/api/messages/*` (chat)
- **`notifications.js`** - `/api/notifications/*` (notifications)

---

### **📂 `/middleware`** - Request Processing Middleware
- **`auth.js`** - JWT authentication middleware (`protect`, `authorize`)
- **`validate.js`** - Request validation middleware (express-validator)

---

### **📂 `/utils`** - Utility Functions
- **`generateToken.js`** - JWT token generation
- **`emailService.js`** - Email sending (Nodemailer)
- **`pdfService.js`** - PDF generation for invoices/reports

---

### **📂 `/scripts`** - Database Seeding & Utility Scripts
Helper scripts for database setup and testing:

- **`createAdmin.js`** - Create admin user
- **`createGuest.js`** - Create guest user
- **`createReceptionist.js`** - ⚠️ Legacy (receptionist role removed)
- **`seedDashboardData.js`** - Seed sample dashboard data
- **`seedAllDashboards.js`** - Seed all role dashboards
- **`seedProfessionalData.js`** - Seed professional hotel data
- **`addRoomImages.js`** - Add sample room images
- **`addSampleGalleryImages.js`** - Add gallery images
- **`resetAdminPassword.js`** - Reset admin password
- **`testAdminLogin.js`** - Test admin authentication
- **`testEmail.js`** - Test email service
- **`fixEmailSettings.js`** - Fix email configuration
- **`addEmailSettings.js`** - Add email settings

---

### **📂 `/temp`** - Temporary Files
Storage for temporary uploads (before Cloudinary processing)

---

## 🎨 Frontend Structure (`/frontend`)

### **Core Files**
- **`public/index.html`** - HTML template
- **`public/logo.png`** - App logo
- **`src/index.js`** - React app entry point
- **`src/App.jsx`** - Main App component (routing, authentication)
- **`src/App.css`** - Global app styles
- **`src/index.css`** - Base CSS reset and global styles
- **`package.json`** - Frontend dependencies (React, React Router, Axios, Cloudinary)

---

### **📂 `/src/components`** - Reusable UI Components
- **`Navbar.jsx`** / **`Navbar.css`** - Top navigation bar (role-based links)
- **`AdminLayout.jsx`** / **`AdminLayout.css`** - Admin panel sidebar layout
- **`GuestFooter.jsx`** - Footer component for guest pages
- **`NotificationBell.jsx`** / **`NotificationBell.css`** - Notification dropdown
- **`Chat.jsx`** / **`Chat.css`** - Chat component (⚠️ Currently removed/disabled)
- **`GoogleSignIn.jsx`** - Google OAuth button
- **`PrivateRoute.jsx`** - Protected route wrapper (requires authentication)

---

### **📂 `/src/pages`** - Page Components (Route Views)

#### **`/admin`** - Admin Panel Pages
- **`Dashboard.jsx`** - Admin dashboard (stats, overview)
- **`Users.jsx`** - User management (CRUD)
- **`Rooms.jsx`** - Room management (create, edit, delete)
- **`Reservations.jsx`** - Reservation management (check-in/out)
- **`Billing.jsx`** - Invoice/billing management
- **`Reports.jsx`** - Analytics and reports
- **`Gallery.jsx`** / **`Gallery.css`** - Image gallery management
- **`Settings.jsx`** - System settings
- **`Housekeeping.jsx`** - ⚠️ Legacy (housekeeping removed)
- **`Maintenance.jsx`** - ⚠️ Legacy (maintenance removed)

#### **`/guest`** - Guest Panel Pages
- **`Dashboard.jsx`** - Guest dashboard (bookings overview)
- **`Rooms.jsx`** - Browse available rooms
- **`RoomDetails.jsx`** - Individual room details and booking
- **`Reservations.jsx`** - Guest's booking history
- **`Billing.jsx`** - Guest invoices and payments
- **`Services.jsx`** - Services information page (informative)
- **`Feedback.jsx`** - Submit feedback/reviews
- **`Gallery.jsx`** / **`Gallery.css`** - View hotel gallery
- **`AboutUs.jsx`** / **`AboutUs.css`** - About page
- **`GuestDashboard.css`** - Shared styles for guest pages

#### **`/manager`** - ⚠️ Empty (Manager role removed)
#### **`/receptionist`** - ⚠️ Empty (Receptionist role removed)
#### **`/housekeeping`** - ⚠️ Empty (Housekeeping role removed)

#### **Root Pages**
- **`Login.jsx`** - Login page
- **`Register.jsx`** - Registration page
- **`RoleBasedDashboard.jsx`** - Dynamic dashboard based on user role
- **`Notifications.jsx`** / **`Notifications.css`** - Notifications page

---

### **📂 `/src/context`** - React Context API
- **`AuthContext.jsx`** - Global authentication state management
  - Provides `user`, `login`, `logout`, `loading` to all components

---

### **📂 `/src/styles`** - Global Stylesheets
- **`Auth.css`** - Authentication page styles (login/register)
- **`Responsive.css`** - Responsive design breakpoints and utilities

---

## 🔐 Role-Based Access Control

### **Current Roles (After Simplification)**
1. **`admin`** - Full system access
   - User management, room management, reservations, billing, reports, settings
   
2. **`guest`** - Guest access
   - View rooms, make reservations, view bills, submit feedback, view gallery

### **Removed Roles** (code cleaned up)
- ❌ `manager` - Removed
- ❌ `receptionist` - Removed  
- ❌ `housekeeping` - Removed

---

## 🔄 Data Flow

```
Frontend (React) 
    ↓ HTTP Requests (Axios)
Backend Routes (/routes)
    ↓ Middleware (auth, validate)
Controllers (/controllers)
    ↓ Database Operations
Models (/models) → MongoDB
    ↓ Response
Frontend (React Components)
```

---

## 📦 Key Dependencies

### **Backend**
- **Express** - Web framework
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **Cloudinary** - Image storage
- **Nodemailer** - Email service
- **express-validator** - Input validation

### **Frontend**
- **React** - UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **@cloudinary/react** - Image display

---

## 🚀 Running the Application

### **Development Mode**
```bash
# Root directory
npm run devall          # Runs both backend and frontend concurrently

# Or separately:
npm run dev             # Backend only (port 5000)
npm run client          # Frontend only (port 3000)
```

### **Production Mode**
```bash
# Backend
cd backend && npm start

# Frontend
cd frontend && npm run build
# Serve the build folder with a static server
```

---

## 📝 Notes

1. **Duplicate Files**: Some files have both `.js` and `.jsx` versions (legacy). The `.js` versions are typically the active ones.

2. **Empty Folders**: `/pages/manager`, `/pages/receptionist`, `/pages/housekeeping` are empty (roles removed).

3. **Chat Feature**: Chat component exists but is currently disabled/removed from navigation.

4. **Image Storage**: Uses Cloudinary for production, `/temp` folder for local development.

5. **Environment Variables**: Backend uses `.env` file (not in repo) for:
   - MongoDB connection string
   - JWT secret
   - Cloudinary credentials
   - Email service credentials

---

## 🎯 Quick Reference

| Purpose | Location |
|---------|----------|
| Add new API endpoint | `/backend/routes/` + `/backend/controllers/` |
| Add new database model | `/backend/models/` |
| Add new page | `/frontend/src/pages/` |
| Add reusable component | `/frontend/src/components/` |
| Modify authentication | `/backend/middleware/auth.js` |
| Seed database | `/backend/scripts/` |
| Global styles | `/frontend/src/styles/` |

---

**Last Updated:** After role simplification (admin + guest only)

