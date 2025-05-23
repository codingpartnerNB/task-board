import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { loginSuccess, logout } from './redux/slices/authSlice';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector(state => state.auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(loginSuccess({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        }));
      } else {
        dispatch(logout());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex flex-col items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.8, rotate: -15 }}
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="relative"
        >
          {/* Main loader with 3D effect */}
          <div className="relative z-10 h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 shadow-2xl flex items-center justify-center">
            <div className="absolute inset-0 bg-white/10 rounded-2xl backdrop-blur-sm"></div>
            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-inner">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-700 to-blue-700 animate-pulse"></div>
            </div>
          </div>

          {/* Floating particles */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                opacity: 0,
                x: Math.random() * 100 - 50,
                y: Math.random() * 100 - 50
              }}
              animate={{ 
                opacity: [0.2, 0.8, 0.2],
                x: Math.random() * 100 - 50,
                y: Math.random() * 100 - 50
              }}
              transition={{
                duration: 3 + Math.random() * 3,
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * 0.5
              }}
              className="absolute h-2 w-2 rounded-full bg-purple-300"
              style={{
                left: `${50 + (Math.random() * 40 - 20)}%`,
                top: `${50 + (Math.random() * 40 - 20)}%`
              }}
            />
          ))}
        </motion.div>

        <motion.p 
          className="mt-8 text-white/80 font-medium text-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Loading your workspace...
        </motion.p>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key={isAuthenticated ? 'dashboard' : 'login'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
      >
        {isAuthenticated ? (
          <Dashboard />
        ) : (
          <LoginPage />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default App;