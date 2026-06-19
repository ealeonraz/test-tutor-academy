import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { signIn, signOut, getMyProfile } from "../api/auth";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Hydrate from the current Supabase session and keep in sync with auth changes.
  useEffect(() => {
    let active = true;

    const hydrate = async (session) => {
      if (!active) return;
      if (session?.access_token) {
        setAuthToken(session.access_token);
        localStorage.setItem("token", session.access_token);
        try {
          const profile = await getMyProfile();
          if (active) setUser(profile);
        } catch (err) {
          console.error("Failed to load profile:", err);
        }
      } else {
        setAuthToken(null);
        setUser(null);
        localStorage.removeItem("token");
      }
      if (active) setLoading(false);
    };

    supabase.auth.getSession().then(({ data }) => hydrate(data.session));

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      hydrate(session);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // data: { email, password }
  const login = async (data) => {
    try {
      const { profile, session } = await signIn(data);
      setAuthToken(session?.access_token || null);
      if (session?.access_token) localStorage.setItem("token", session.access_token);
      setUser(profile);
      navigate(`/${profile?.role || "student"}-dashboard`);
      return;
    } catch (err) {
      console.error("Login error:", err);
      throw err; // let the login form surface the message
    }
  };

  const logout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("Logout error:", err);
    }
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ authToken, login, logout, user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
