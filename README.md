# HR Management System
A full-stack **HR Management Portal** where employees can request leaves, managers can approve/reject them, and admins can configure policies, manage teams, and view all leave-related data. This portal streamlines internal HR processes for efficient leave tracking and approval.

<img  width="1080" height="492"  alt="Screenshot 2025-08-12 at 12 05 39 PM" src="https://github.com/user-attachments/assets/018e7044-4c08-4df8-a371-b146e9cec4c0" />

<img width="1080" height="492"  alt="Screenshot 2025-08-12 at 12 06 23 PM" src="https://github.com/user-attachments/assets/ec4a7e88-c6cf-4ef7-8970-f73000f5caed" />

<img width="1080" height="492" alt="Screenshot 2025-08-12 at 12 08 24 PM" src="https://github.com/user-attachments/assets/527f4fe6-a78d-4e18-945f-4c0cfe851b24" />

---

## Roles & Features

### 👨‍💼 Employee
- Apply for leave by choosing a date range and reason
- View their own leave history and leave balance
- Track leave status (pending/approved/rejected)

### 🧑‍🏫 Manager
- View and manage team members’ leave requests
- Approve or reject pending requests
- View team calendar

### 👩‍💻 Admin
- Configure total leaves, leave types, holidays
- Approve/reject any leave requests
- Manage all users and teams
- View leave usage analytics 

---

## 🛠️ Tech Stack

This project is built with:

- **Next.js** – Full-stack React Framework
- **React** – UI library
- **TypeScript** – Static typing
- **shadcn/ui** – Prebuilt component system using Radix & Tailwind
- **Tailwind CSS** – Utility-first styling
- **Vite** – Lightning fast dev server and bundler

All `shadcn/ui` components are pre-installed under `@/components/ui`.

---

## 🔍 Navigation Guide

| Path                   | Description                                      | Access Role       |
|------------------------|--------------------------------------------------|-------------------|
| `/`                    | Landing page with project intro or welcome      | Public            |
| `/login`               | Login screen for all roles                      | Public            |
| `/index`               | Dashboard that redirects based on user role     | Employee / Manager / Admin |
| `/leaves`              | View user's own leave history & status          | Employee          |
| `/apply-leave`         | Apply for a new leave                           | Employee          |
| `/work-from-home`      | Request work from home                          | Employee          |
| `/team-leaves`         | View & manage team leave requests               | Manager           |
| `/admin`               | Admin panel for configuring policies, holidays  | Admin             |
| `*` (fallback route)   | Page Not Found                                  | Public            |

---

## 🔐 Demo Credentials (for testing)

Use the following credentials to test different roles in the app:

| Role     | Email                         | Password      |
|----------|-------------------------------|---------------|
| Employee | employee@gmail.com | `password123` |
| Manager  | manager@gmail.com   | `password123` |
| Admin    | admin@gmail.com      | `password123` |

---
  
