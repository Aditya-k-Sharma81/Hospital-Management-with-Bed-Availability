# Patient Frontend - Bed Management System

This is the **Patient-Facing Portal** for the Bed Management System, built with **React** and **Vite**. It allows patients to book appointments, view doctors, manage their profiles, and access their receipts.

## 🚀 Features

### 👤 Patient Services
*   **Book Appointments**: Browse doctors by specialization and book appointments.
*   **Find Doctors**: filterable list of doctors based on specialty.
*   **User Profile**: Manage personal details and contact information.
*   **My Appointments**: View history of upcoming and past appointments.
*   **Receipts**: Access and view billing receipts for services and bed allocations.
*   **Authentication**: Secure login and registration for patients.

### 🌐 Pages
*   **Home**: Landing page with services overview and top doctors.
*   **Doctors**: Comprehensive list of available doctors with filtering.
*   **About Us**: Information about the hospital/clinic.
*   **Contact**: Contact details and inquiry form.
*   **Login**: User authentication page.

## 🛠️ Tech Stack
*   **Frontend**: React (Vite)
*   **Styling**: Tailwind CSS
*   **Routing**: React Router DOM (v7)
*   **Notifications**: React Toastify
*   **HTTP Client**: Axios

## 📦 Installation & Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
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

*   `src/pages`: Individual page components (Home, Doctors, Login, MyProfile, etc.).
*   `src/components`: Reusable UI components (Navbar, Footer, etc.).
*   `src/assets`: Static assets like images and icons.

## 🔗 Navigation
The application uses `react-router-dom` for client-side routing:
*   `/` - Home Page
*   `/doctors` - All Doctors
*   `/doctors/:speciality` - Filter Doctors by Specialty
*   `/login` - Login / Signup
*   `/my-profile` - User Profile
*   `/my-appointments` - Appointment History
*   `/my-receipts` - Billing Receipts
*   `/appointment/:docId` - Book Appointment with specific Doctor
