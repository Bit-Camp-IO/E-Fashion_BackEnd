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

## Prerequisites

Before running the app, ensure that you have the following:

- [Node.js](https://nodejs.org/en) and npm
- [Mongodb](https://www.mongodb.com/)
- Create [brevo](https://www.brevo.com/) account, you'll need this for SMTP email services
- Install [Stripe Cli](https://stripe.com/docs/stripe-cli) for testing payments during development.
- Generate public and private key token
- Create new [Firebase](https://firebase.google.com/) project for notification

## Getting Started

1. Clone the project repository:
   Use Git to clone the project repository to your local machine.

   ```bash
   git clone https://github.com/Bit-Camp-IO/E-Fashion_BackEnd.git
   ```

2. Navigate to the Project Directory
   Change your current directory to the project folder.

   ```bash
   cd E-Fashion_BackEnd
   ```

3. Set up environment variables:

   Simply add the environment variables in your application by creating a .env file based on the provided .env.example template and replacing the example values with your actual configuration.

4. Create or update the `firebase.json` file with your Firebase Hosting configuration

5. Install project dependencies:
   Use npm to install the project dependencies specified in the package.json file.

   ```bash
   npm install
   ```

   Use npm ci to install the project dependencies specified in the package-lock.json file. This command is recommended for a more efficient and reproducible installation process.

   ```bash
   npm ci
   ```

6. Build the project:
   ```bash
   npm build
   ```
7. Start the project:
   ```bash
   npm run start
   ```

## Swagger Documentation

This project includes Swagger documentation for the API endpoints. You can access it at:

- http://localhost:8080/docs

The Swagger documentation provides details about the available API endpoints, request and response formats, and how to use the API effectively.

## Features

### Authentication

- **JWT Tokens**: Secure user authentication and authorization using JSON Web Tokens for implementing refresh and access tokens.

- **Google Authentication**: Enable users to log in seamlessly with their Google accounts.
- **Password Reset**: Allow users to reset their passwords using email-based one-time passwords (OTPs).

### Product Catalog

- Filter and sort products by category, gender, price, and brand.
- Search functionality to find specific products.

### Product Details

- View detailed information for each product, including images, description, price, and available sizes and colors.

### Shopping Cart

- Add products to a shopping cart.
- Adjust product quantities and remove items from the cart.
- Calculate the total order amount.

### Checkout and Payment with [Stripe](https://stripe.com/)

- Secure and streamlined checkout process .
- Multiple payment options (credit/debit cards, cash).
- Shipping and delivery options.

### User Profiles

- User profiles with personal information and order history.
- Edit user details and change passwords.

### Favorites

- Save favorite products to a favorites list.

### Product Reviews and Ratings

- Read and write product reviews and ratings.

### Order Tracking

- Track the status of orders.
- Receive real-time updates on order processing and shipping.

### Firebase Notifications

- **Real-time Notifications**: Send instant notifications to users.
- **Various Notification Types**: Differentiate between general, message, and order status notifications.
- **User-Centric**: Address specific users or broadcast messages to everyone.
- **Notification History**: Store notifications for future reference.

### Real-Time Chat with Socket.io

E-Fash backend supports real-time chat functionality for customer support using Socket.io. This feature fosters seamless communication between users.

### Email Integration with [brevo](https://www.brevo.com/)

We've integrated email capabilities for various essential functions, such as order confirmations, password resets, and important notifications. This integration ensures that you receive critical information in your inbox promptly.

## Scripts

- `npm start`: Start the application in development mode.
- `npm run start-production`: Start the application in production mode.
- `npm run start-watch`: Start the application with Nodemon for auto-reloading in development.
- `npm run build`: Build the TypeScript code.
- `npm test`: Run tests

## License

This project is licensed under the [Apache-2](https://www.apache.org/licenses/LICENSE-2.0) License.

## Contact

If you have any questions, suggestions, or feedback, please contact the project maintainer:

Email: mahmoudkhaled1215@gmail.com
GitHub: [Bit-Camp-IO](https://github.com/Bit-Camp-IO)
