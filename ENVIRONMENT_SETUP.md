# Environment Setup Guide

## Prerequisites
- Node.js (v18+)
- npm

## Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd chem-mastery
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Copy `.env.example` to `.env.local` and update the values.
    ```bash
    cp .env.example .env.local
    ```
    
    Required variables:
    - `DATABASE_URL`: `file:./dev.db` (for SQLite)
    - `NEXTAUTH_SECRET`: Generate one with `openssl rand -base64 32`
    - `NEXTAUTH_URL`: `http://localhost:3000`

4.  **Database Setup**
    Initialize the SQLite database and run migrations.
    ```bash
    npm run db:migrate
    ```

    Seed the database with initial data.
    ```bash
    npm run db:seed
    ```

5.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Access the app at `http://localhost:3000`.

## Testing
Run the implementation test suite to verify the setup:
```bash
./test-implementation.sh
```
