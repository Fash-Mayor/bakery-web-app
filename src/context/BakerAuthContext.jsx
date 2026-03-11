import { createContext, useContext, useState, useEffect } from "react";
import { getSupabaseClient } from "../utils/dataService";

const BakerAuthContext = createContext(null);

export const BakerAuthProvider = ({ children }) => {
  const [baker, setBaker] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseClient();

  useEffect(() => {
    // Check if baker is stored in localStorage
    const storedBaker = localStorage.getItem("baker");
    if (storedBaker) {
      try {
        setBaker(JSON.parse(storedBaker));
      } catch (error) {
        console.error("Error parsing stored baker:", error);
        localStorage.removeItem("baker");
      }
    }
    setLoading(false);
  }, []);

  const loginBaker = (bakerData) => {
    setBaker(bakerData);
    localStorage.setItem("baker", JSON.stringify(bakerData));
  };

  const logoutBaker = () => {
    setBaker(null);
    localStorage.removeItem("baker");
  };

  const updateBakerData = (updates) => {
    const updatedBaker = { ...baker, ...updates };
    setBaker(updatedBaker);
    localStorage.setItem("baker", JSON.stringify(updatedBaker));
  };

  return (
    <BakerAuthContext.Provider
      value={{ baker, loading, loginBaker, logoutBaker, updateBakerData }}
    >
      {children}
    </BakerAuthContext.Provider>
  );
};

export const useBakerAuth = () => {
  const context = useContext(BakerAuthContext);
  if (!context) {
    throw new Error("useBakerAuth must be used within BakerAuthProvider");
  }
  return context;
};
