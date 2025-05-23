import React from 'react';
import { useSelector } from 'react-redux';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getUserInitials } from '@/lib/utils';
import { motion } from 'framer-motion';

const OnlineUsers = () => {
  const { users, onlineUsers } = useSelector(state => state.users);
  const onlineUsersList = onlineUsers.map(userId => users[userId]).filter(Boolean);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-5 m-3 border border-gray-100 overflow-hidden"
      style={{
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 to-transparent opacity-30 pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <span className="relative mr-2">
              <span className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="relative">Online Users</span>
            </span>
          </h3>
          <div className="flex items-center space-x-1">
            <span className="text-xs font-medium px-2.5 py-1 bg-blue-100/50 text-blue-800 rounded-full">
              {onlineUsersList.length} online
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {onlineUsersList.length > 0 ? (
            onlineUsersList.map((user, index) => (
              <motion.div
                key={user.uid}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="flex items-center p-2 rounded-lg hover:bg-gray-50/80 transition-colors duration-200 group"
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative mr-3">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="relative"
                  >
                    <Avatar className="h-10 w-10 border-2 border-white shadow-md">
                      {user.photoURL ? (
                        <AvatarImage src={user.photoURL} alt={user.displayName} className="object-cover" />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800">
                          {getUserInitials(user.displayName)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
                  </motion.div>
                  <div className="absolute -inset-1 bg-blue-200/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{user.displayName}</p>
                  <p className="text-xs text-gray-500">Active now</p>
                </div>
                <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse ml-auto"></div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center py-6 text-center"
            >
              <div className="w-16 h-16 mb-3 bg-gray-100 rounded-full flex items-center justify-center shadow-inner">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-gray-300 border-2 border-white"></div>
                </div>
              </div>
              <p className="text-gray-500 font-medium mb-1">No users online</p>
              <p className="text-gray-400 text-sm">When users come online, they'll appear here</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default OnlineUsers;