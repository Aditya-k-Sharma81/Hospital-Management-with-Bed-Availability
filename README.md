# Hospital Management System with Bed Availability

A comprehensive, full-stack **Hospital Management System** built with the **MERN Stack** (MongoDB, Express, React, Node.js). This application streamlines hospital operations by integrating patient appointment booking, doctor management, and a real-time bed availability tracking system for hospital staff.

## 🚀 Key Features

### 🏥 Patient Portal (Frontend)
*   **Book Appointments**: Patients can browse doctors by specialization and book available slots.
*   **Doctor Directory**: Filterable list of doctors to find the right specialist.
*   **User Profiles**: Manage personal details and view appointment history.
*   **Authentication**: Secure login and registration.

### 🛡️ Admin & Staff Dashboard
*   **Role-Based Access**:
    *   **Admin**: Full control to add doctors, manage beds, and view all appointments.
    *   **Doctor**: dedicated dashboard to view their schedule and patient details.
    *   **Staff**: Real-time tools to manage bed inventory.
*   **Real-Time Bed Tracking**: Powered by **Socket.io**, staff can mark beds as "Occupied" or "Available", with updates reflecting instantly across all connected devices.
*   **Auto-Discharge System**: Automated background jobs checking for expired admissions to free up bed inventory.

## 🛠️ Technology Stack

*   **Frontend**: React.js (Vite), Tailwind CSS, React Router v7
*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB (Mongoose ODM)
*   **Real-Time Communication**: Socket.io
*   **Authentication**: JSON Web Tokens (JWT)
*   **Asset Storage**: Cloudinary (for images)

## 📂 Project Structure

*   **`/backend`**: The Node.js/Express API server.
*   **`/frontend`**: The patient-facing React application.
*   **`/admin`**: The administrative dashboard for staff and doctors.

## ⚡ Getting Started

Follow these steps to set up the project locally.

### Prerequisites
*   Node.js (v14 or higher)
*   MongoDB Atlas Connection String
*   Cloudinary Account (for image uploads)

### 1. Backend Setup
1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` directory and add your credentials:
    ```env
    PORT=4000
    MONGODB_URI=your_mongodb_connection_string
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    JWT_SECRET=your_jwt_secret
    ```
4.  Start the server:
    ```bash
    npm start
    ```

### 2. Admin Panel Setup
1.  Open a new terminal and navigate to the admin folder:
    ```bash
    cd admin
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

### 3. Frontend (Patient App) Setup
1.  Open a new terminal and navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## 🧪 Usage Guide

1.  **Open the Admin Panel** (usually `http://localhost:5174`) to log in as an Admin. Add some doctors and bed inventory.
2.  **Open the Patient Frontend** (usually `http://localhost:5173`). Create a user account and book an appointment with a doctor.
3.  **Test Real-Time Features**: Open the Admin/Staff panel in two different tabs. Changing bed status in one tab should instantly update the other.

## 📜 License
This project is for educational purposes.
