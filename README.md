# Ticketing Application

A comprehensive, scalable microservices-based application for selling generic tickets for events. Built with a modern tech stack including Node.js, TypeScript, Next.js, Docker, Kubernetes, and NATS Jetstream streaming Server.

## 📋 Table of Contents

- [About The Project](#-about-the-project)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
- [Testing](#-testing)
  - [Test Strategy](#test-strategy)
  - [Running Tests](#running-tests)
  - [CI/CD Pipeline](#cicd-pipeline)
- [API Reference](#-api-reference)
- [Directory Structure](#-directory-structure)
- [Contributing](#-contributing)

---

## 🚀 About The Project

This application serves as a demonstration of a robust microservices architecture. It simulates a real-world ticketing platform where users can:

- **Sign Up/Sign In**: Secure authentication using JWTs.
- **List Tickets**: Users can create and manage their own ticket listings.
- **Purchase Tickets**: Secure payment processing for tickets.
- **Order Management**: View and follow up on orders.

Key functionality includes:

- **Concurrency Control**: Implements optimistic concurrency control (using Mongoose version keys) to prevent race conditions when multiple users try to edit the same ticket.
- **Order Expiration**: Features a 15-minute reservation window. If an order isn't paid for within this time, it is automatically cancelled, releasing the ticket back to the pool. This is handled via a delayed job queue (`BullMQ`) and Redis.
- **Event-Driven Architecture**: Services communicate asynchronously using a NATS Jetstream streaming Server event bus, ensuring decoupling and high availability.

## 🏗 Architecture

The application is decomposed into individually deployable services. All services run in Docker containers within a Kubernetes cluster.

### Services

| Service        | Description                                                                                                        | Path                |
| :------------- | :----------------------------------------------------------------------------------------------------------------- | :------------------ |
| **Auth**       | Handles user authentication (Signup, Signin, Signout, Current User). Issues JWTs via cookies.                      | `server/auth`       |
| **Tickets**    | Manages ticket creation, updating, and querying. Publishes events when tickets are created/updated.                | `server/tickets`    |
| **Orders**     | Controls the order lifecycle (creation, cancellation, completion). Listens for ticket and expiration events.       | `server/orders`     |
| **Expiration** | Acts as a timer service. It receives "order created" events and queues a job to expire the order after 15 minutes. | `server/expiration` |
| **Payments**   | Handles credit card charges using Stripe. Listens for created orders and cancelled orders.                         | `server/payments`   |
| **Client**     | A Next.js (React) frontend application. Uses Server-Side Rendering (SSR) to fetch data from services.              | `client`            |

### Shared Library

- **@alibabatickets/common**: A shared NPM package containing reusable code such as error handling middlewares, event definitions (Publishers/Listeners), and request validation helpers.

## 🛠 Tech Stack

### Frontend

- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Styling**: Bootstrap 5
- **Payments**: Stripe Elements

### Backend

- **Runtime**: [Node.js](https://nodejs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Framework**: Express.js
- **Database**: MongoDB (managed via Mongoose), Redis (for caching & queues)
- **Event Bus**: [NATS Jetstream streaming Server](https://docs.nats.io/nats-streaming-concepts/intro) (STAN)
- **Queue**: BullMQ (handling job queues in the Expiration service)

### DevOps & Infrastructure

- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **Development Workflow**: [Skaffold](https://skaffold.dev/) (handles building, pushing, and deploying changes automatically)
- **Ingress**: NGINX Ingress Controller

---

## ⚙️ Getting Started

Follow these steps to get a local copy up and running.

### Prerequisites

You need the following tools installed:

- **Docker**: [Get Docker](https://docs.docker.com/get-docker/)
- **Kubernetes**: Enable Kubernetes in Docker Desktop or use [Minikube](https://minikube.sigs.k8s.io/docs/start/).
- **Skaffold**: [Install Skaffold](https://skaffold.dev/docs/install/)
- **Ingress NGINX**: [Install Guide](https://kubernetes.github.io/ingress-nginx/deploy/).
  - _Note_: This is crucial for routing traffic to the correct service (e.g. `api/users` -> Auth Service).

### Installation

1.  **Clone the repo**

    ```sh
    git clone https://github.com/alibaba0010/Ticketing-APP.git
    cd Ticketing-APP
    ```

2.  **Define Environment Variables (Kubernetes Secrets)**
    The application relies on JWT keys and Stripe keys being available as secrets in the cluster. Run the following commands:

    ```bash
    # Create a secret for JWT signing
    kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf

    # Create a secret for Stripe API
    # Replace 'your_stripe_key' with your actual Stripe Secret Key
    kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=your_stripe_key
    ```

3.  **Update Hosts File**
    The Ingress controller routes traffic based on the domain `ticketing.com`. You need to map this domain to your localhost.

    - **Windows**: `C:\Windows\System32\drivers\etc\hosts`
    - **Linux/Mac**: `/etc/hosts`

    Add this line:

    ```
    127.0.0.1 ticketing.com
    ```

### Running Locally

We use **Skaffold** to handle the workflow. It will build the Docker images, push them (or load them locally), and apply the K8s manifests.

```bash
skaffold dev
```

- **Wait for startup**: Docker will download dependencies and build images. This might take a few minutes the first time.
- **Access the App**: Open [https://ticketing.com](https://ticketing.com) in your browser. Accept the self-signed certificate warning (type `thisisunsafe` on Chrome if needed, or click Advanced -> Proceed).

---

## 🧪 Testing

We place a high emphasis on testing to ensure reliability across microservices.

### Test Strategy

- **Unit & Integration Tests**: Each service has its own isolated test suite.
- **Database Isolation**: We use `mongodb-memory-server` to spin up an in-memory copy of MongoDB for fast, isolated tests. We do _not_ use a shared database for testing.
- **Event Mocking**: NATS wrapper is mocked in tests to ensure services can be tested without a running NATS server. We verify that the correct events are published.
- **Dependencies**: `jest` (Runner), `supertest` (HTTP assertions), `ts-jest` (Typescript support).

### Running Tests

Tests are run within the context of each individual service.

**To run tests for a specific service (e.g., Auth):**

```bash
cd server/auth
npm test
```

This runs `jest` in watch mode.

**To run tests for all services (CI mode):**
You can navigate to each folder and run `npm run test:ci`.

### CI/CD Pipeline

We use **GitHub Actions** for Continuous Integration.

- Workflows are defined in `.github/workflows/`.
- There are separate workflows for each service (e.g., `tests-auth.yml`, `tests-orders.yml`).
- **Trigger**: On every Pull Request or Push to `main` affecting a specific service's directory.
- **Action**: Installs dependencies and runs `npm run test:ci`.

---

## 📡 API Reference

Here is a quick summary of the primary route namespaces:

**Auth Service**

- `POST /api/users/signup` - Register a new user
- `POST /api/users/signin` - Login
- `POST /api/users/signout` - Logout
- `GET /api/users/currentuser` - Get current session info

**Tickets Service**

- `GET /api/tickets` - List all tickets
- `POST /api/tickets` - Create a ticket
- `GET /api/tickets/:id` - Get ticket details
- `PUT /api/tickets/:id` - Update a ticket

**Orders Service**

- `GET /api/orders` - Get current user's orders
- `POST /api/orders` - Create an order (reserve a ticket)
- `GET /api/orders/:id` - Get order details
- `DELETE /api/orders/:id` - Cancel an order

**Payments Service**

- `POST /api/payments` - Submit payment for an order

---

## 📂 Directory Structure

```
├── client/                 # Next.js Frontend Application
├── infra/                  # Kubernetes configuration manifests (K8s)
├── server/                 # Backend Microservices
│   ├── auth/               # Authentication Service
│   ├── common/             # Shared Library (@alibabatickets/common)
│   ├── expiration/         # Expiration Service (Redis/BullMQ)
│   ├── orders/             # Orders Service
│   ├── payments/           # Payments Service
│   └── tickets/            # Tickets Service
└── skaffold.yaml           # Skaffold Dev Configuration
```

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
