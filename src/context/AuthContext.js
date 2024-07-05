import { createContext, useEffect, useState } from "react";
import { authApp, firestoreApp } from "../config/firebase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [globalMsg, setGlobalMsg] = useState("");

  const register = (email, password) => {
    return authApp.createUserWithEmailAndPassword(email, password);
  };

  const login = (email, password) => {
    return authApp.signInWithEmailAndPassword(email, password);
  };

  const adminLogin = (email, password) => {
    // Aquí puedes definir la lógica para el inicio de sesión administrativo
    // Por ejemplo, puedes verificar si el email y la contraseña coinciden con las credenciales de administrador
    if (email === "admin@gmail.com" && password === "adminpro") {
      return authApp.signInWithEmailAndPassword(email, password);
    } else {
      throw new Error("Invalid admin credentials");
    }
  };

  const logout = () => {
    return authApp.signOut();
  };

  const bidAuction = (auctionId, price) => {
    if (!currentUser) {
      return setGlobalMsg("Please login first");
    }

    let newPrice = Math.floor((price / 100) * 110);
    const db = firestoreApp.collection("auctions");

    return db.doc(auctionId).update({
      curPrice: newPrice,
      curWinner: currentUser.email,
    });
  };

  const endAuction = (auctionId) => {
    const db = firestoreApp.collection("auctions");

    return db.doc(auctionId).delete();
  };

  useEffect(() => {
    const unsubscribe = authApp.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const interval = setTimeout(() => setGlobalMsg(""), 5000);
    return () => clearTimeout(interval);
  }, [globalMsg]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        register,
        login,
        adminLogin, // Agregar adminLogin al contexto
        logout,
        bidAuction,
        endAuction,
        globalMsg,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
