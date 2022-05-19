import { useContext, useState, useEffect, createContext } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/Firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";

const AuthContex = createContext();

export const useAuth = () => {
  return useContext(AuthContex);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();

  const [loading, setLoading] = useState(true);

  const singIn = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const logOut = () => auth.signOut();

  // Clients CRUD
  const saveClient = (name, type, phone, address) =>
    setDoc(doc(db, "clients", phone), {
      name,
      type,
      phone,
      address,
    });

  const getClientbyId = (idRef) => getDoc(doc(db, "clients", idRef));

  const onGetData = (collectionRef, callback) =>
    onSnapshot(collection(db, collectionRef), callback);

  const onGetClientById = (idRef, callback) => {
    const unsub = onSnapshot(doc(db, "clients", idRef), callback);
    return unsub;
  };

  const deleteClientById = (idRef) => deleteDoc(doc(db, "clients", idRef));

  //Sales CRUD
  const saveSale = (
    clientData,
    products,
    total,
    credit,
    payAmount,
    payArray
  ) => {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    setDoc(doc(collection(db, "sales")), {
      clientData,
      products,
      total,
      credit,
      payAmount,
      date: today.toLocaleDateString("es-CR"),
      payArray,
    });
  };

  const getSaleById = (idRef) => getDoc(doc(db, "sales", idRef));

  //Products CRUD
  const saveProduct = (description, price) =>
    setDoc(doc(collection(db, "products")), {
      description,
      price,
    });

  const saveProductById = (id, description, price) =>
    setDoc(doc(db, "products", id), {
      description,
      price,
    });

  const getProductbyId = (idRef) => getDoc(doc(db, "products", idRef));

  const deleteProductById = (idRef) => deleteDoc(doc(db, "products", idRef));

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    singIn,
    logOut,
    saveClient,
    getClientbyId,
    onGetData,
    deleteClientById,
    onGetClientById,
    saveProduct,
    saveProductById,
    getProductbyId,
    deleteProductById,
    saveSale,
    getSaleById,
  };

  return (
    <AuthContex.Provider value={value}>
      {!loading && children}
    </AuthContex.Provider>
  );
};
