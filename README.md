![Project Version](https://img.shields.io/badge/version-0.0.1-blue)
[![License](https://img.shields.io/badge/License-Apache_2.0-green.svg)](https://opensource.org/licenses/Apache-2.0)



# E-Fash e-commerce Backend

This repository functions as the backend for the E-Fash e-commerce app, serving E-Fashion Flutter and Kotlin applications. Built with TypeScript, Express.js, and MongoDB utilizing Mongoose, the project adheres to clean architecture principles, ensuring modularity and scalability at its core

## Technologies & Libraries Used

We aimed to minimize reliance on third-party services, prioritizing in-house solutions wherever possible.

- Express.js
- Mongoose
- Socket.io
- Winston
- Busboy
- Dotenv
- Firebase-Admin
- Joi
- Jsonwebtoken
- Nodemailer
- Stripe
- Swagger-jsdoc
- Swagger-ui-express
- Axios
- Bcrypt

## Getting Started

1. Clone the project repository:

   ```bash
   git clone https://github.com/Bit-Camp-IO/E-Fashion_BackEnd.git 

2. Set up environment variables:
   
   Simply add the environment variables in your application by creating a .env file based on the provided .env.example template and replacing the example values with your actual configuration.


3. Create or update the `firebase.json` file with your Firebase Hosting configuration

4. Install project dependancies:
   ```bash
   npm install

5. Build the project:
   ```bash
   npm build
6. Start the project:
   ```bash
   npm run start

## Swagger Documentation
This project includes Swagger documentation for the API endpoints. You can access it at:

- http://localhost:8080/docs

The Swagger documentation provides details about the available API endpoints, request and response formats, and how to use the API effectively.

## Features

### Firebase Notifications

- **Real-time Notifications**: Send instant notifications to users.
- **Various Notification Types**: Differentiate between general, message, and order status notifications.
- **User-Centric**: Address specific users or broadcast messages to everyone.
- **Notification History**: Store notifications for future reference.

### Real-Time Chat with Socket.io

E-Fash backend supports real-time chat functionality for customer support using Socket.io. This feature fosters seamless communication between users.

### Email Integration

We've integrated email capabilities for various essential functions, such as order confirmations, password resets, and important notifications. This integration ensures that you receive critical information in your inbox promptly.


## Authentication

- **JWT Tokens**: Secure user authentication and authorization using JSON Web Tokens for implementing refresh and access tokens.

- **Google Authentication**: Enable users to log in seamlessly with their Google accounts.
- **Password Reset**: Allow users to reset their passwords using email-based one-time passwords (OTPs).

## Scripts
- `npm start`: Start the application in development mode.
- `npm run start-production`: Start the application in production mode.
- `npm run start-watch`: Start the application with Nodemon for auto-reloading in development.
- `npm run build`: Build the TypeScript code.
- `npm test`: Run tests 

## License
This project is licensed under the Apache-2 License.
