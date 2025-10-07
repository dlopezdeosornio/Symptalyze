import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthLanding from "./pages/AuthLanding";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./contexts/AuthProvider";
import { useAuth } from "./hooks/useAuth";

function AppContent() {
  const { currentUser } = useAuth();
  

  return (
    <BrowserRouter basename="/Symptalyze">
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