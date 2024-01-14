# WS Chat

#### Video Demo: [Your Video URL Here]

#### Description:

Welcome to my WS Chat, a real-time online chatting platform built using Angular v17 for the client side, Material UI for the user interface, and Node.js with Express for the server side. The application leverages the power of Socket.IO to enable seamless and instant communication between users.

### Features:

- **Real-time Communication:** Our chat application provides a real-time, bi-directional communication channel between multiple users. This is achieved through the implementation of WebSocket technology using Socket.IO.

- **Angular and Material UI:** The client side of the application is built using the Angular framework, offering a dynamic and responsive user interface.

- **Node.js and Express:** The server-side of the application is powered by Node.js and Express, providing a robust and scalable backend.

- **SQLite Database:** The application utilizes SQLite3 as its database to store and manage user data, chat history, and other essential information.

- **Authentication with Basic Validation:** Users can log in to the chat application with a simple authentication system that includes basic validation. This ensures a level of security and helps maintain the integrity of user interactions

### How to Run the Application:

1. **Install Dependencies:**

cd /client
npm install
cd /server
npm install

2. **Run the Application:**
- Start the client (Angular):
  ```
  cd /client
  npm run start
  ```

- Start the server (Node.js):
  ```
  cd /server
  npm run dev
  ```

4. **Open in Browser:**
Open your web browser and navigate to `http://localhost:4200` to access the WebSocket Chat Application.

### Design Choices:

- **WebSocket for Real-Time Communication:** I chose WebSocket with Socket.IO to enable real-time communication between users, ensuring a smooth and responsive chat experience.

- **Angular and Material UI for the Client:** Angular's component-based architecture and Material UI's pre-built components simplify the development of a feature-rich and visually appealing frontend.

- **SQLite for Database:** SQLite's simplicity and compatibility with Node.js made it an ideal choice for my lightweight chat application. It provides the necessary persistence without introducing unnecessary complexity.
