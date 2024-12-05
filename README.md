# ToDo.app

## Project Description

**ToDo.app** This is a server-side application for managing task lists (ToDo), developed using NestJS. The application already includes a ready-made authentication system, allowing users to register, log in and protect their data with tokens. Thanks to the modular architecture, the application is easy to scale and expand with new features.

**Location:** Yerevan  
**Date:** 04/2024

**Developer:**  
Web Development in Nestjs
**Name:** Gagikovich Gor Mkhitaryan

**Project URL:** [todo-auth-nestjs](https://github.com/mypy125/auth-nestjs-prisma)

## Description

This project is a web application developed using NestJS that provides user management features.
The main functionality includes registration, authorization, and management of user data through API.

## Technology Stack
- **NestJS:** A framework for building server-side applications using TypeScript that supports modular architecture.
- **TypeScript** The primary development language using strong typing.
- **Prisma Migrations** ORM for interaction with the database, provides ease of working with queries and migrations.
- **Jest** Used for unit testing and writing integration tests.
- **Supertest** For testing HTTP endpoints.
- **JWT (JSON Web Token)** For authentication and authorization of users.
- **BcryptJS** Hashing user passwords for secure storage.
- **Express.js** Used as the default HTTP server in NestJS.

## Database
- **MySQL** A relational database for storing user information.
- **Prisma Migrations** Manage your database schema and its migrations.

## Testing
- **ts-jest** TypeScript integration with Jest.
- **Mocking Services** To isolate tests and check the functionality of individual modules.

## Development tools
- **ESLint и Prettier** To check the quality of code and formatting.
- **Git** Version control.
- **Docker** (if necessary): To containerize the application and database.

## Application Benefits
- Create a new user with username and email uniqueness check. Passwords are stored encrypted using bcrypt.
- Login via JWT token.Generate and verify access tokens for secure endpoints.
- Getting information about users.Updating user data (name, email, password).Deleting a user.
- Checking access rights via Guards (e.g. JwtAuthGuard).Protecting endpoints from unauthorized access.
- Detailed error messages such as "User already exists", "User not found", or "Access denied".
- Tests for checking CRUD operations.Tests for checking authorization and access restrictions.

