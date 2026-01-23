import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Approutes from './router.jsx';
import { AuthProvider } from './context/AuthContext';

const App = () => {

  return (
    <AuthProvider>
      <Router>
        <Approutes />
      </Router>
    </AuthProvider>
  );
};
export default App;
