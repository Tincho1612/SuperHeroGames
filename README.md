# 🦸 SuperHero Game – Frontend (Angular Client)

## Overview

This project is the **Angular 16 frontend client** for the SuperHero Game platform.

It consumes a secured Spring Boot backend API and handles authentication, token management, protected routes, hero search, battle registration, and user account interactions.

The goal of this application is to demonstrate full-stack integration:

Frontend (Angular) → Backend (Spring Boot + JWT) → PostgreSQL (Neon Cloud)

🌐 **Live Application (Vercel):**  
https://superherogame-xi.vercel.app/

⚙️ **Backend API (Render):**  
https://superherogame-backend.onrender.com

---

## 🛠 Tech Stack

- Angular 16  
- TypeScript  
- HTML  
- CSS + Bootstrap  
- Angular Router  
- HttpClient  
- Reactive Forms  
- RxJS (BehaviorSubject / Subject for component communication)  
- Vercel (Deployment)  

---

## 🔐 Authentication & API Integration

The frontend integrates with a secured JWT-based backend.

### Implemented Features

- 🔐 Login & Registration  
- 🎟 JWT token storage in localStorage  
- 🛡 Authorization header injection (Bearer token)  
- 🔒 Protected routes (authenticated user required)  
- 📧 Email confirmation flow  
- 🔁 Password recovery & reset flow  
- 👤 Authenticated user data retrieval  

The application dynamically attaches:

# Authorization: Bearer <token>

to protected backend requests.

---

## 🧩 Core Functionalities

### 👤 User Features

- Retrieve authenticated user data  
- Update email  
- Update password  
- Add heroes to favorites  
- Remove heroes from favorites  

---

### ⚔️ Battle System

- Register new battles  
- Retrieve user battle history  

---

### 🦸 Hero Search

The application integrates with the public SuperHero API:

- Search heroes by name  
- Retrieve hero details  
- Calculate custom hero statistics (average power score)

Custom statistics are computed client-side using a dedicated service.

---

## 🧠 Architecture Highlights

The frontend follows a service-based architecture:

- Services encapsulate API communication  
- Separation between backend API service and external SuperHero API service  
- Dedicated statistics calculation service  
- Component communication handled via RxJS Subjects / BehaviorSubjects  
- Reactive Forms for input validation and state management  

This structure keeps UI components clean and business logic centralized in services.

---

## ☁️ Deployment

- Hosted on **Vercel**
- Connected to a production backend deployed on **Render**
- Communicates with a cloud PostgreSQL database (Neon)

This setup mirrors a real-world full-stack production environment.

---

## 🚀 Run Locally

    ```bash

    npm install
    
    ng serve