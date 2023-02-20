import { useContext, useState, useEffect, createContext } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/Firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
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
    done,
    paid,
    payAmount,
    date,
    month,
    year,
    payArray
  ) => {
    const refDoc = doc(collection(db, "sales"));

    setDoc(refDoc, {
      clientData,
      products,
      total,
      credit,
      done,
      paid,
      payAmount,
      date,
      month,
      year,
      payArray,
    });

    return refDoc.id;
  };

  const updateSale = (id, payAmount, payArray, paid) => {
    updateDoc(doc(db, "sales", id), {
      payAmount,
      payArray,
      paid,
    });
  };

  const setSaleDone = (id, done) => {
    updateDoc(doc(db, "sales", id), {
      done,
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

  const saveBill = (
    description,
    total,
    credit,
    paid,
    payAmount,
    payArray,
    date,
    month,
    year
  ) =>
    setDoc(doc(collection(db, "bills")), {
      description,
      total,
      credit,
      paid,
      payAmount,
      payArray,
      date,
      month,
      year,
    });

  const updateBill = (id, payAmount, payArray, paid) => {
    updateDoc(doc(db, "bills", id), {
      payAmount,
      payArray,
      paid,
    });
  };

  const getBillById = (idRef) => getDoc(doc(db, "bills", idRef));

  //Accounting CRUD QUERIES

  const getPaidOrNotQuery = (value) => {
    const dataRef = collection(db, "sales");
    const q = query(dataRef, where("paid", "==", value));
    return getDocs(q);
  };

  const getBillsPaidOrNotQuery = (value) => {
    const dataRef = collection(db, "bills");
    const q = query(dataRef, where("paid", "==", value));
    return getDocs(q);
  };

  const getSalesByDateQuery = (dateValue) => {
    const dataRef = collection(db, "sales");
    const q = query(
      dataRef,
      where("date", "==", dateValue.toDateString())
    );
    return getDocs(q);
  };

  const getIncomeDataDaily = (dateValue) => {
    const dataRef = collection(db, "sales");
    const q = query(dataRef, where("date", "==", dateValue.toDateString()));
    return getDocs(q);
  };

  const getIncomeDataMonthly = (dateValue) => {
    const dataRef = collection(db, "sales");
    const q = query(
      dataRef,
      where("month", "==", dateValue.getMonth()),
      where("year", "==", dateValue.getFullYear())
    );
    return getDocs(q);
  };

  const getIncomeDataYearly = (dateValue) => {
    const dataRef = collection(db, "sales");
    const q = query(dataRef, where("year", "==", dateValue.getFullYear()));
    return getDocs(q);
  };

  const getOutComeDataDaily = (dateValue) => {
    const dataRef = collection(db, "bills");
    const q = query(dataRef, where("date", "==", dateValue.toDateString()));
    return getDocs(q);
  };

  const getOutcomeDataMonthly = (dateValue) => {
    const dataRef = collection(db, "bills");
    const q = query(
      dataRef,
      where("month", "==", dateValue.getMonth()),
      where("year", "==", dateValue.getFullYear())
    );
    return getDocs(q);
  };

  const getOutcomeDataYearly = (dateValue) => {
    const dataRef = collection(db, "bills");
    const q = query(dataRef, where("year", "==", dateValue.getFullYear()));
    return getDocs(q);
  };

  const saveRecovery = (saleId, name, payAmount, date, month, year, type) =>
    setDoc(doc(collection(db, "recoveries")), {
      saleId,
      name,
      payAmount,
      date,
      month,
      year,
      type
    });

  const getRecoveryDataDaily = (dateValue) => {
    const dataRef = collection(db, "recoveries");
    const q = query(dataRef, where("date", "==", dateValue.toDateString()));
    return getDocs(q);
  };

  const getRecoveryDataMonthly = (dateValue) => {
    const dataRef = collection(db, "recoveries");
    const q = query(
      dataRef,
      where("month", "==", dateValue.getMonth()),
      where("year", "==", dateValue.getFullYear())
    );
    return getDocs(q);
  };

  const getRecoveryDataYearly = (dateValue) => {
    const dataRef = collection(db, "recoveries");
    const q = query(dataRef, where("year", "==", dateValue.getFullYear()));
    return getDocs(q);
  };

  const saveOrder = (client, description) =>
    setDoc(doc(collection(db, "orders")), {
      client,
      description,
    });

  const deleteOrder = (idRef) => deleteDoc(doc(db, "orders", idRef));

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
    saveBill,
    updateSale,
    getBillById,
    updateBill,
    getPaidOrNotQuery,
    getSalesByDateQuery,
    getIncomeDataDaily,
    getIncomeDataMonthly,
    getIncomeDataYearly,
    getOutComeDataDaily,
    getOutcomeDataMonthly,
    getOutcomeDataYearly,
    getBillsPaidOrNotQuery,
    setSaleDone,
    saveRecovery,
    getRecoveryDataDaily,
    getRecoveryDataMonthly,
    getRecoveryDataYearly,
    saveOrder,
    deleteOrder,
  };

  return (
    <AuthContex.Provider value={value}>
      {!loading && children}
    </AuthContex.Provider>
  );
};
