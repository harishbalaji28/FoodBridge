# 🍽️ FoodBridge — Campus & Community Surplus Food Rescue

> **"Good food deserves another plate."**  
> A student-led, real-time food rescue platform connecting dining halls, campus events, and cafeterias with students and staff before edible surplus food goes to waste.

---

## 1. Project Description
**FoodBridge** is a modern, community-oriented web application designed to eliminate food waste across college campuses and local communities. It bridges the gap between surplus food providers (event organizers, dining halls, canteens, student clubs) and hungry campus members by enabling quick manual food listing, live countdown-tracked discovery, transparent portion claiming, and measurable sustainability impact analytics.

---

## 2. Problem It Solves
- **Massive Campus Food Waste:** Large batches of fresh food prepared for department seminars, conferences, cultural fests, and dining halls often go untouched and are discarded into landfills at the end of the day.
- **Student Food Insecurity:** Many students experience tight budgets or busy schedules and could benefit directly from available, free meals.
- **Time Sensitivity & Lack of Coordination:** Fresh food perishes quickly. Without real-time visibility, live countdown timers, and precise pickup points, extra food spoils before anyone knows it is available.
- **FoodBridge Solution:** A frictionless platform where donors list surplus portions in seconds, students claim portions with student ID verification, and everyone tracks real-time carbon and water savings.

---

## 3. Features Implemented

### 🍲 Real-Time Food Listing & Discovery
- **100% Manual Item Entry:** Food donors manually type whatever food is available (e.g., *Vegetable Biryani*, *Sandwiches*, *Pastries*). No hardcoded food lists or fixed food images.
- **Detailed Pickup Points:** Explicit campus location notes (e.g., *"Block A - Room 204 Student Lounge"*).
- **Dietary & Handling Notes:** Optional details covering dietary tags (Vegetarian, Dairy, etc.) and storage instructions.

### ⏱️ Live Countdown & Expiry Engine
- **Live Per-Second Countdown:** Visual `HH:MM:SS` timer on every food card based on the donor's `bestBefore` date.
- **High-Urgency Alert State:** Highlights listings with less than 1 hour remaining (`🔥 Expiring Soon (<1h)`).
- **Backend Expiry Validation:** Automatically transitions listings to `"expired"` when the deadline passes, disabling claim actions and preventing late claims at the server level.

### 👥 Portion Claim System
- **Interactive Claim Modal:** Claimers enter their Name, Student/Staff Registration Number, and requested portions.
- **Strict Server Validation:** Rejects invalid servings (0, negative, fractional) and requests exceeding remaining portions.
- **Auto-Close:** Automatically sets status to `"closed"` when all portions are claimed.

### 🌱 Sustainability Impact Metrics
- **Servings Saved:** Real-time counter of all claimed and consumed portions.
- **Servings Missed:** Unclaimed portions from expired posts.
- **Rescue Rate Gauge:** Percentage of total food successfully rescued:
  $$\text{Rescue Rate} = \frac{\text{Servings Saved}}{\text{Servings Saved} + \text{Servings Missed}} \times 100$$
- **Environmental Equivalence:** Calculates equivalent $\text{CO}_2$ emissions avoided (~$0.85\text{ kg}/\text{meal}$) and liters of embedded water conserved (~$120\text{ L}/\text{meal}$).

### 🔍 Interactive Search, Filters & Skeletons
- **Instant Search:** Real-time query matching across food name, description, and pickup location.
- **Filter Tabs:** Quickly toggle between *All*, *Available Now*, *Expiring Soon (<1h)*, *Claimed*, and *Expired*.
- **Sorting:** Sort by *Soonest Expiry*, *Most Servings*, or *Newly Listed*.
- **Accessible State Handling:** Shimmer loading skeletons, clean empty states, and error banners with retry triggers.

---

## 4. Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18 (Vite) | Single-page responsive interface & state coordination |
| **Styling** | Vanilla CSS Design System | Custom food-inspired color palette, CSS variables, glassmorphism, responsive grid |
| **Icons** | Lucide React | Lightweight icons for food, sustainability, and locations |
| **Backend** | Node.js + Express | RESTful API routes, claim validation, expiry checks |
| **Data Store** | In-Memory / File-backed JSON (`db.json`) | Lightweight, self-initializing database that persists across server restarts |
| **Middleware** | CORS + `dotenv` + `express.json` | Cross-origin request management & environment config |

---

## 5. Frontend Setup

```bash
# Navigate to the client directory
cd client

# Install frontend dependencies
npm install

# Start development server
npm run dev
```
The frontend dev server runs at: `http://localhost:5173`

---

## 6. Backend Setup

```bash
# Navigate to the server directory
cd server

# Install backend dependencies
npm install

# Start development server
npm run dev
```
The backend server runs at: `http://localhost:5000`

---

## 7. Environment Variables

### Client (`client/.env`)
```env
# URL pointing to the Express backend API
VITE_API_URL=http://localhost:5000/api
```

### Server (`server/.env`)
```env
# Server listen port (defaults to 5000 if not set)
PORT=5000

# Optional frontend origin for CORS restriction in production
CLIENT_URL=http://localhost:5173
```

---

## 8. API Endpoints Reference

| Method | Endpoint | Description | Request Body / Query Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Health check | None |
| `GET` | `/api/posts` | List all food listings | Optional query: `?status=available`, `open`, `closed`, `expired` |
| `POST` | `/api/posts` | Create a new surplus food listing | `{ foodName, description, totalServings, pickupPoint, bestBefore }` |
| `POST` | `/api/posts/:id/claims` | Claim portions from an active post | `{ claimerName, registrationNumber, servings }` |
| `GET` | `/api/stats` | Platform impact metrics | Returns `{ totalPosts, openPosts, closedPosts, expiredPosts, servingsSaved, servingsMissed, rescueRate }` |

---

## 9. How to Run Locally

### Step 1: Clone the repository
```bash
git clone <repository-url>
cd FoodBridge
```

### Step 2: Start the Backend Server (Terminal 1)
```bash
cd server
npm install
npm run dev
```

### Step 3: Start the Frontend Client (Terminal 2)
```bash
cd client
npm install
npm run dev
```

### Step 4: Open in Browser
Visit `http://localhost:5173` to explore the live application.

---

## 10. Live Deployment Links

- **Frontend App:** `https://foodbridge-demo.vercel.app` *(Placeholder — replace with production URL upon deploy)*
- **Backend API:** `https://foodbridge-api.onrender.com` *(Placeholder — replace with production URL upon deploy)*

---

## 11. Application Screenshots

### 🌟 Hero & Live Active Listings
*(Placeholder for Hero and Available Food Cards screenshot)*
```
+-------------------------------------------------------------------------------+
|  🌱 Zero Waste Campus                                                         |
|  Good food deserves another plate.                                            |
|  [Find Available Food]   [Post Surplus Food]                                  |
|                                                                               |
|  +-------------------------------------+  +--------------------------------+  |
|  | 🍲 Vegetable Biryani & Raita        |  | 🥗 42+ Meals Rescued This Week |  |
|  | 📍 Main Canteen | ⏱️ 01:45:00       |  +--------------------------------+  |
|  | [6 / 10 remaining] [Claim Meal]     |                                      |
|  +-------------------------------------+                                      |
+-------------------------------------------------------------------------------+
```

### 📋 Post Food & Live Claim Modal
*(Placeholder for Post Surplus Food Form and Claim Modal dialog screenshot)*

### 📊 Real-Time Sustainability Impact Dashboard
*(Placeholder for Impact Statistics and Rescue Rate Progress Bar screenshot)*

---

## 12. "How I Used AI" Section

### Collaboration Statement & Integrity
In developing **FoodBridge**, AI (Google Antigravity / Gemini) was utilized as an **interactive pair-programming assistant** to accelerate scaffolding, UI refinement, and edge-case testing.

- **Architecture & Design:** System requirements, product rules (manual food entry without hardcoded items, real-time countdown, strict server-side validation, zero-waste calculation logic), and data schemas were established by the project author.
- **Implementation & Review:** AI generated code boilerplate, responsive CSS styling tokens, and test suite assertions. Every component, API route, and state handler was line-by-line reviewed, tested, and validated by the author to ensure complete understanding and maintainability.
- **Interview Readiness:** All code logic (including the `setInterval` countdown lifecycle, Express route handlers, JSON persistence, and mathematical rescue rate computation) can be explained and defended during the competition evaluation.
