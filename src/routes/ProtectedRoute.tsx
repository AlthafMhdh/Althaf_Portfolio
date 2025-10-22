// import React, { type JSX } from "react";
// import { Navigate } from "react-router-dom";
// import { auth } from "../firebase/config";

// type ProtectedRouteProps = {
//   children: JSX.Element;
// };

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
//     const user = auth.currentUser;

//   if (!user) {
//     // Not logged in, redirect to login
//     return <Navigate to="/login" replace />;
//   }
//   return children;
// };

// export default ProtectedRoute;

import React, { useEffect, type JSX } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase/config";

type ProtectedRouteProps = {
  children: JSX.Element;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const INACTIVITY_LIMIT = 60 * 60 * 1000; // 60 minutes
    let inactivityTimer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        auth.signOut();
        window.location.href = "/login"; // Redirect after logout
      }, INACTIVITY_LIMIT);
    };

    // List of events to track activity
    const events = ["mousemove", "keydown", "scroll", "click"];

    // Reset timer when user performs any of these actions
    events.forEach((event) => window.addEventListener(event, resetTimer));

    // Initialize the timer for the first time
    resetTimer();

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [user]);

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
