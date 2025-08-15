# Interactive Metadata Dashboard

[![React](https://img.shields.io/badge/React-18.x-%2361DAFB?logo=react)](https://reactjs.org/)
[![GraphQL](https://img.shields.io/badge/GraphQL-%23E10098?logo=graphql)](https://graphql.org/)
[![Material UI](https://img.shields.io/badge/Material%20UI-5.x-%230081CB?logo=mui)](https://mui.com/)
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-%23000000?logo=vercel)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Backend-Render-%2346E3B7?logo=render)](https://render.com/)

An enterprise-grade, responsive dashboard for managing and exploring dataset metadata. This full-stack application is built with React, Material UI, and a GraphQL backend, demonstrating a complete end-to-end development and deployment workflow for modern SaaS tools.

### ✨ **Live Demo**

**[https://metadata-dashboard-project-siaf.vercel.app/](https://metadata-dashboard-project-siaf.vercel.app/)**

### 📸 Screenshots

[ADD YOUR SCREENSHOT HERE]
*(A full-width screenshot of the dashboard showing the table and search bar would be perfect here. A second screenshot showing the details drawer with charts is also a great idea.)*

---

## 🚀 Core Features

*   **Interactive Data Table:** A paginated and searchable table displays a complete list of datasets with key information like owner, freshness, and tags.
*   **Powerful Search & Filtering:**
    *   Filter datasets in real-time by name or tags.
    *   **Conversational Search:** A proof-of-concept natural language filter (e.g., "show datasets updated last week").
*   **Detailed Asset View:** Clicking a dataset opens a side drawer with comprehensive metadata, including:
    *   **Schema Browser:** A clear view of column names, data types, and descriptions.
    *   **Data Lineage:** A visual diagram showing upstream sources and downstream consumers.
    *   **Usage Analytics:** Interactive charts built with **Recharts** to visualize query volume and freshness trends over time.
*   **GraphQL Backend:** A mock GraphQL API built with `apollo-server` serves realistic, paginated data and handles complex filtering logic.
*   **Responsive Design:** The UI is fully responsive, providing a seamless experience on both desktop and mobile devices, thanks to Material UI's robust grid system.
*   **Performance Optimized:**
    *   **Lazy Loading:** The detailed view drawer and its heavy charting components are lazy-loaded to improve initial page load times.
    *   **Debounced Search:** API calls are debounced to prevent excessive requests while the user is typing.

---

## 🛠️ Tech Stack

| Category            | Technology                                                            |
| ------------------- | --------------------------------------------------------------------- |
| **Frontend**        | React, Vite, Material UI (MUI), Recharts                              |
| **GraphQL Client**  | Apollo Client                                                         |
| **Backend**         | Node.js, Apollo Server, GraphQL                                       |
| **Data Generation** | `@faker-js/faker`, `date-fns`                                             |
| **Deployment**      | Vercel (Frontend), Render (Backend)                                   |
| **Dev Tools**       | Git, GitHub, Prettier                                                 |

---

## ⚙️ Local Development Setup

To run this project on your local machine, you will need two separate terminal windows.

### Prerequisites

*   Node.js (v18 or later)
*   npm or yarn

### 1. Backend Server (`metadata-api`)

First, start the GraphQL API server.

```bash
# 1. Clone the repository
git clone https://github.com/seriesatul/metadata-dashboard-project.git
cd metadata-dashboard-project

# 2. Navigate to the backend directory
cd metadata-api

# 3. Install dependencies
npm install

# 4. Start the server
npm start
```
The API server will be running at `http://localhost:4000`.

### 2. Frontend Application (`metadata-dashboard`)

In a **new terminal window**, start the React frontend application.

```bash
# 1. (If not already there) Navigate to the project's root directory
cd path/to/metadata-dashboard-project

# 2. Navigate to the frontend directory
cd metadata-dashboard

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```
The frontend application will be available at `http://localhost:5173` (or another port if 5173 is in use).

---

## 🌐 Deployment

This monorepo project is deployed as two separate services:

*   The **React frontend** is deployed as a static site on **Vercel**, configured to use the `metadata-dashboard` directory as its root.
*   The **Node.js/GraphQL backend** is deployed as a web service on **Render**, configured to use the `metadata-api` directory as its root.

Continuous deployment is enabled via GitHub. Any push to the `master` branch will automatically trigger new builds on both platforms.
