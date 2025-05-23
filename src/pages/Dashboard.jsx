import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '@/redux/thunks';
import { setupSocketListeners, socket } from '@/lib/socket';
import { motion } from 'framer-motion';
import Board from '@/components/Board';
import OnlineUsers from '@/components/OnlineUsers';
import Navbar from '@/components/Navbar';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const boardId = import.meta.env.VITE_BOARD_ID;
  
  useEffect(() => {
    // Fetch users
    dispatch(fetchUsers());
    
    // Setup socket listeners
    setupSocketListeners(dispatch);
    
    // Connect socket if user is authenticated
    if (user) {
      socket.auth = { userId: user.uid };
      socket.connect();
    }
    
    // Cleanup
    return () => {
      socket.disconnect();
    };
  }, [dispatch, user]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden"
    >
      {/* Enhanced Navbar with subtle 3D effect */}
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area with depth effect */}
        <motion.main 
          className="flex-1 overflow-y-auto"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <div className="flex justify-between items-center mb-6">
              <motion.h1 
                className="text-3xl font-bold text-gray-800"
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-purple-800">
                  Task Board
                </span>
              </motion.h1>
              
              {/* Status indicator with pulse animation */}
              {user && (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full shadow-sm"
                >
                  <div className="relative">
                    <div className="absolute -inset-1 bg-blue-400 rounded-full blur opacity-75 animate-pulse"></div>
                    <div className="relative h-2 w-2 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Connected</span>
                </motion.div>
              )}
            </div>
            
            {/* Board Container with 3D depth */}
            <motion.div 
              className="h-full rounded-xl bg-white shadow-lg border border-gray-200 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-transparent pointer-events-none"></div>
              <Board boardId={boardId} />
            </motion.div>
          </div>
        </motion.main>
        
        {/* Sidebar with 3D effect and glass morphism */}
        <motion.aside 
          className="w-72 p-4 hidden lg:block overflow-y-auto"
          initial={{ x: 20 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="h-full bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-gray-200/70 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-blue-50/30 pointer-events-none"></div>
            <div className="relative z-10 h-full">
              <div className="p-4 border-b border-gray-200/70">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                    Team Activity
                  </span>
                </h2>
              </div>
              <OnlineUsers />
            </div>
          </motion.div>
        </motion.aside>
      </div>
    </motion.div>
  );
};

export default Dashboard;