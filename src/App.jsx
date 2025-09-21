import { Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import Chat from "./pages/chat";
import Profile from "./pages/profile";
import { useAppStore } from "./store";
import { useEffect, useState } from "react";
import { apiClient } from "./lib/api-client.js";
import { GET_USER_INFO } from "./utils/constants.js";

const App = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await apiClient.get(GET_USER_INFO, { withCredentials: true });
        if (res.status === 200 && res.data.id) {
          setUserInfo(res.data);
        } else {
          setUserInfo(undefined);
        }
      } catch (err) {
        setUserInfo(undefined);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);

  // Cyan-theme loader with dark-gray background
  const Loader = () => (
    <div style={loaderStyles.container}>
      <div style={loaderStyles.spinner}></div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  if (loading) return <Loader />;

  const PrivateRoute = ({ children }) => {
    const { userInfo } = useAppStore();
    return userInfo ? children : <Navigate to="/auth" />;
  };

  const AuthRoute = ({ children }) => {
    const { userInfo } = useAppStore();
    return userInfo ? <Navigate to="/chat" /> : children;
  };

  return (
    <Routes>
      <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
      <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/auth" />} />
    </Routes>
  );
};

// Inline styles for the loader
const loaderStyles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#1e1e1e" // dark gray background
  },
  spinner: {
    width: "60px",
    height: "60px",
    border: "6px solid rgba(0, 255, 255, 0.2)", // faint cyan base
    borderTop: "6px solid #00ffff",            // bright cyan accent
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  }
};

export default App;
