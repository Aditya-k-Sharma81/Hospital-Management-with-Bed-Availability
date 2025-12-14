# Admin Dashboard - Bed Management System

This is the Admin Panel for the Bed Management System, built with **React** and **Vite**. It serves as the central control hub for Administrators, Doctors, and Staff to manage hospital operations, including bed allocation, doctor management, and appointment scheduling.

## 🚀 Features

### 🔑 User Roles & Access
The application dynamically renders interfaces based on the logged-in user's role:

*   **Admin**:
    *   **Dashboard**: Overview of hospital statistics.
    *   **All Appointments**: View and manage patient appointments.
    *   **Add Doctor**: Register new doctors into the system.
    *   **Doctor List**: View and manage existing doctors.
    *   **Add Bed**: Manage bed inventory and types.
*   **Doctor**:
    *   **Doctor Dashboard**: View personal appointments and patient details.
*   **Staff**:
    *   **Staff Dashboard**: Manage day-to-day operations.
    *   **Bed Availability**: Real-time view of bed occupancy and availability.

### 🛠️ Tech Stack
*   **Frontend**: React (Vite)
*   **Styling**: Tailwind CSS
*   **Routing**: React Router DOM
*   **Notifications**: React Toastify
*   **Real-time Updates**: Socket.io Client
*   **HTTP Client**: Axios

## 📦 Installation & Setup

1.  **Navigate to the admin directory:**
    ```bash
    cd admin
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Build for production:**
    ```bash
    npm run build
    ```

## 📂 Project Structure

*   `src/pages/Admin`: Components for Admin functionalities (Dashboard, Add Doctor, etc.).
*   `src/pages/Doctor`: Components for Doctor functionalities.
*   `src/pages/Staff`: Components for Staff functionalities.
*   `src/context`: Context providers for managing authentication and state (`AdminContext`, `DoctorContext`, `StaffContext`).
*   `src/components`: Reusable UI components like `Navbar`, `Sidebar`.

## 🤝 Context & State Management
The application uses React Context API to manage user sessions:
*   `AdminContext`: Manages Admin authentication token (`aToken`).
*   `DoctorContext`: Manages Doctor authentication token (`dToken`).
*   `StaffContext`: Manages Staff authentication token (`sToken`).

## ✨ Key Functionalities
*   **Authentication**: Secure login for different roles.
*   **Bed Management**: Track bed availability, allocation, and discharge.
*   **Doctor Management**: Add and list doctors with their specializations.
*   **Appointments**: Centralized view of all appointments.
