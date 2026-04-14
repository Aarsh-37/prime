# PrimeTrade Backend Developer Intern Assignment

A robust, scalable REST API built with Node.js and MongoDB, alongside a responsive React.js dashboard. 

## Features

### Backend
- **Authentication**: Secure JWT-based Login and Registration.
- **Security**: Passwords hashed with `bcryptjs`. API locked down with JWT tokens.
- **Role-Based Access Control**: 
  - `user`: Can only view and modify their own tasks.
  - `admin`: Can view all tasks across the system and modify any task.
- **Modular Architecture**: Clean separation between Routes, Controllers, Models, and Middlewares.
- **API Documentation**: Interactive Swagger UI available at `/api-docs`.

### Frontend
- **React.js**: Bootstrapped with Vite and React Router Dom.
- **Premium Design**: Vanilla CSS utilizing CSS variables, responsive grids, and modern aesthetic cues.
- **Axios Interceptors**: Automatically injects the JWT token into all outgoing requests.
- **Dynamic Dashboard**: Full CRUD system with live updates and Toast-like error messages.

## Running the Application Locally

### Requirements
- Node.js (v16+)
- MongoDB (running locally on port `27017` or change the `MONGO_URI` in `backend/.env`)

### 1. Setup Backend
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
   *The backend will run on `http://localhost:5000`*
   *Access API Docs at `http://localhost:5000/api-docs`*

### 2. Setup Frontend
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Click the link provided in the terminal (usually `http://localhost:5173`) to view the application.

## Scalability Note

To scale this application in a production environment:

1. **Microservices Architecture**: The `Tasks` logic could be separated into its own microservice if the domain grows, utilizing a message broker (like RabbitMQ or Kafka) for inter-service communication (e.g., if we need to send an email notification when a task is updated).
2. **Caching**: Implementing Redis query caching in the backend. Frequently accessed paths (like `GET /api/v1/tasks`) can return cached generic lists, cutting down direct MongoDB hits.
3. **Load Balancing & Docker**: Containerizing the Node.js application and using Kubernetes or AWS ECS to run multiple replicas behind an NGINX or AWS ALB load balancer.
4. **Database Indexing**: Utilizing compound indexing in MongoDB for queries filtering by `user` and `status` to ensure fast lookups as millions of tasks are created.
