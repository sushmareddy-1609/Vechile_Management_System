# FleetLog — Vehicle Management System

A full-stack CRUD application for managing a vehicle fleet, built with **Spring Boot + MySQL** on the backend and **React + Tailwind** on the frontend.

## Features

**Core**
- Add, view, edit, and delete vehicles (model, brand, owner, registration number, type)
- Unique registration number validation (server-side)

**Extra features included**
- Fuel type, status (Active / Inactive / Under Maintenance / Sold), color, year, mileage, purchase date, insurance expiry, notes
- Search across model/brand/owner/registration + filter by type and status
- Server-side pagination and sorting
- Maintenance / service history per vehicle (service type, cost, odometer, next-service-due) with a running cost total
- Dashboard with fleet counts, charts (by type / by status), total maintenance spend, and an "insurance expiring within 30 days" alert list
- CSV export of the full fleet
- Centralized validation + error handling with clean JSON error responses

## Project Structure

```
vms/
├── backend/     Spring Boot 3 / Java 17 REST API
└── frontend/    React 18 + Vite + Tailwind CSS
```

## Run Everything From One Terminal

Instead of two terminals, you can start both the backend and frontend together with a single command using `concurrently`:

```bash
cd vms
npm install              # installs the "concurrently" tool at the root
npm run install:frontend # installs frontend dependencies (one-time)

npm run dev               # Windows — starts backend + frontend together
npm run dev:unix          # macOS/Linux — starts backend + frontend together
```

Output from both servers streams into the same terminal, prefixed and color-coded `BACKEND` (blue) / `FRONTEND` (green). Press `Ctrl+C` once to stop both.

## Backend Setup (manual / two-terminal)

**Requirements:** Java 17+, Maven, MySQL 8+

1. Create the database (or let the app auto-create it):
   ```sql
   CREATE DATABASE vms_db;
   ```
2. Update credentials in `backend/src/main/resources/application.properties` if needed:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=root
   ```
3. Run it:
   ```bash
   cd backend
   ./mvnw spring-boot:run       # macOS/Linux — no local Maven install needed
   mvnw.cmd spring-boot:run     # Windows
   ```
   The first run downloads Maven 3.9.6 automatically into `~/.m2/wrapper/dists` (one-time, needs internet access), then every future run reuses it. If you already have Maven installed, `mvn spring-boot:run` works too.

   The API starts on **http://localhost:8080**. Tables are created automatically via Hibernate (`ddl-auto=update`).

### Key API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/vehicles?keyword=&type=&status=&page=&size=&sortBy=&direction=` | Search/list vehicles (paginated) |
| GET | `/api/vehicles/{id}` | Get one vehicle |
| POST | `/api/vehicles` | Create vehicle |
| PUT | `/api/vehicles/{id}` | Update vehicle |
| DELETE | `/api/vehicles/{id}` | Delete vehicle |
| GET | `/api/vehicles/dashboard/stats` | Dashboard statistics |
| GET | `/api/vehicles/export/csv` | Export fleet as CSV |
| GET | `/api/vehicles/{vehicleId}/maintenance` | List maintenance records |
| POST | `/api/vehicles/{vehicleId}/maintenance` | Add maintenance record |
| PUT | `/api/maintenance/{recordId}` | Update maintenance record |
| DELETE | `/api/maintenance/{recordId}` | Delete maintenance record |

## Frontend Setup

**Requirements:** Node.js 18+

```bash
cd frontend
npm install
npm run dev
```

The app starts on **http://localhost:5173** and talks to the API at `http://localhost:8080/api` by default. Override with a `.env` file (see `.env.example`):

```bash
cp .env.example .env
```

## Tech Stack

- **Backend:** Spring Boot 3, Spring Data JPA, Spring Validation, MySQL, Lombok
- **Frontend:** React 18, React Router, Tailwind CSS, Recharts (charts), Axios, Lucide icons

## Notes

- CORS is preconfigured for `localhost:5173` and `localhost:3000` in `application.properties` (`app.cors.allowed-origins`).
- To reset data, drop and recreate `vms_db`, or truncate the `vehicles` / `maintenance_records` tables.
