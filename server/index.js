// const express = require('express');
import express from 'express';
// const http = require('http');
import http from 'http';
// const { Server } = require('socket.io');
import { Server } from 'socket.io';
// const cors = require('cors');
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Store online users
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  const userId = socket.handshake.auth.userId;
  if (userId) {
    // Add user to online users
    onlineUsers.set(socket.id, userId);
    
    // Broadcast user online event
    socket.broadcast.emit('userOnline', { userId });
    
    // Send list of online users to the newly connected user
    const onlineUserIds = [...new Set(onlineUsers.values())];
    socket.emit('onlineUsers', onlineUserIds);
  }
  
  // Task events
  socket.on('createTask', (data) => {
    // Broadcast to all other clients
    socket.broadcast.emit('taskCreated', data.task);
  });
  
  socket.on('updateTask', (data) => {
    socket.broadcast.emit('taskUpdated', data.task);
  });
  
  socket.on('deleteTask', (data) => {
    socket.broadcast.emit('taskDeleted', data.taskId);
  });
  
  socket.on('moveTask', (data) => {
    socket.broadcast.emit('taskMoved', {
      taskId: data.taskId,
      source: data.source,
      destination: data.destination
    });
  });
  
  // Column events
  socket.on('updateColumn', (data) => {
    socket.broadcast.emit('columnUpdated', data.column);
  });
  
  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    const userId = onlineUsers.get(socket.id);
    if (userId) {
      onlineUsers.delete(socket.id);
      
      // Check if user is completely offline (no other connections)
      const stillOnline = [...onlineUsers.values()].includes(userId);
      if (!stillOnline) {
        io.emit('userOffline', userId);
      }
    }
  });
});

// API routes
app.get('/api/status', (req, res) => {
  res.json({ status: 'online', users: onlineUsers.size });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});