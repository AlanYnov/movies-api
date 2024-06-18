# Movies API

Welcome to the Alan's Movies API. This API is made to validate the pratical exercise for "Web Service" module.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Features](#features)
- [Technologies](#technologies)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Database Configuration](#database-configuration)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/download/): Version 20.x recommended.
- [MySQL](https://dev.mysql.com/downloads/): Version 8.x recommended.

## Getting Started

To get started with the Events API, follow the instructions below:

1. **Clone the Repository:** Clone this repository to your local machine.

2. **Environment Configuration:** Create a `.env` file at the root of the project and configure your environment variables, including database connection details, API keys, and other settings, more details [here](#environment-variables).

3. **Install Dependencies:** Run `npm install` to install all project dependencies.

4. **Database Setup:** Configure your database and optionally run migrations or seed data.

5. **Start the Server:** Run `npm start` to start the API server. By default, it runs on port 3002, but you can configure the port in your `.env` file.

6. **API Documentation:** Explore the API endpoints and their documentation using Swagger UI. The documentation is accessible at `/api-docs` when the API server is running.

## Features

The Movies API offers the following key features:

- **Movies Management:** Create, retrieve, update, and delete movies.
- **Files:** Upload and get files.

## Technologies

The Movies API is built using the following technologies and frameworks:

- Node.js and Express.js for server-side development.
- MySQL as a relational database management system.

## Environment Variables

This application requires the following environment variables to run properly:

- `PORT`: The port number for the application to listen on.
- `HOST`: The hostname for the application.
- `NODE_ENV`: Set up the environment values on `production`, `development` or `test`.
- `API_KEY`: The API authentification key.
- `DATABASE_HOST`: The hostname of the database server.
- `DATABASE_USER`: The username for the database.
- `DATABASE_PASSWORD`: The password for the database user.
- `DATABASE_NAME`: The name of the database to connect to.
- `ROOT_DATABASE_USER`: The username of the root to automate the creation of the database and user.
- `ROOT_DATABASE_PASSWORD`: The password of the root to automate the creation of the database and user.

Copy the `.env.example` file to a new file named `.env` and fill in the necessary values.

## Usage

API endpoints and their usage are thoroughly documented using Swagger UI. You can access the API documentation at `/api-docs` when the API server is running. Refer to the documentation for information on making requests and handling responses.

## Database Configuration

### Automatic Configuration

Run the `initDB.sh` script localted at `/database/scripts` to create the database and user automatically:

```bash
sh initDB.sh
```

The error logs will be shown in the following file: `/database/logs/error.log`.

### Manual Configuration

In MySQL, create the `movies_db` database with the following command:

```sql
CREATE DATABASE movies_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Create a MySQL user named `movies_user` with a password of your choice. Grant all privileges to this user on the `movies_db` database.

```sql
CREATE USER 'movies_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON `movies_db`.* TO 'movies_user'@'localhost';
```

After creating the database and a user, copy and execute the following SQL commands found in `/database/sql`:

- **Migrations:** Run all migration files.
- **Inserts:** Run the insertion files to populate the database with test data.

## Contact

If you have any questions or run into any issues while using the Movies API, please contact the API's developper on Teams.