# Real-Time Collaborative Task Board

A modern, real-time collaborative task management application built with React, Redux, Firebase, and Socket.io.

## Features

- Real-time collaboration with multiple users
- Drag and drop task management
- User authentication
- Task assignment, priorities, and due dates
- User presence indicators
- Responsive design that works on all devices

## Technology Stack

- **Frontend**: React.js with JavaScript
- **State Management**: Redux with Redux Toolkit
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **Real-time**: Socket.io
- **Database**: Firebase Firestore and Firebase Realtime Database
- **Authentication**: Firebase Authentication

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. In a separate terminal, start the Socket.io server:
   ```
   npm run server
   ```

## Project Structure

- `/src/components` - React components
- `/src/lib` - Utility functions and Firebase/Socket.io setup
- `/src/redux` - Redux store, slices, and thunks
- `/src/pages` - Page components
- `/server` - Socket.io server for real-time functionality

## Environment Variables

You'll need to set up your Firebase configuration in `/src/lib/firebase.js`.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.