import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthLanding from "./pages/AuthLanding";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

function AppContent() {
  const { currentUser } = useAuth();
  
  // Debug logging
  console.log("App currentUser:", currentUser);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthLanding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={currentUser ? <Dashboard /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;