// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const PrivateRoute = ({ children ,requiredRole }) => {
//     const { user, loading } = useAuth();

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
//             </div>
//         );
//     }

//     if (!user) {
//         return <Navigate to="/login" replace />;
//     }

//      if (
//         requiredRole === 'SERVICE_PROVIDER' &&
//         user.serviceProviderStatus !== 'APPROVED'
//     ) {
//         return <Navigate to="/" replace />;
//     }

//     return children;
// };

// export default PrivateRoute;



import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
