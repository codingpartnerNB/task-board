import { io } from 'socket.io-client';

// Create a socket connection
const socket = io('http://localhost:5000', {
  autoConnect: false,
});

// Socket event listeners
const setupSocketListeners = (dispatch) => {
  // User connected
  socket.on('connect', () => {
    console.log('Connected to server');
  });

  // User disconnected
  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });

  // Task updated
  socket.on('taskUpdated', (task) => {
    dispatch({ type: 'UPDATE_TASK', payload: task });
  });

  // Task created
  socket.on('taskCreated', (task) => {
    dispatch({ type: 'ADD_TASK', payload: task });
  });

  // Task deleted
  socket.on('taskDeleted', (taskId) => {
    dispatch({ type: 'DELETE_TASK', payload: taskId });
  });

  // Column updated
  socket.on('columnUpdated', (column) => {
    dispatch({ type: 'UPDATE_COLUMN', payload: column });
  });

  // User presence
  socket.on('userOnline', (user) => {
    dispatch({ type: 'USER_ONLINE', payload: user });
  });

  // User left
  socket.on('userOffline', (userId) => {
    dispatch({ type: 'USER_OFFLINE', payload: userId });
  });
};

export { socket, setupSocketListeners };