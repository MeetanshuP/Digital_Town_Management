import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Approutes from './router.jsx';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from "react-hot-toast";

const App = () => {

  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Approutes />
      </Router>
    </AuthProvider>
  );
};
export default App;
