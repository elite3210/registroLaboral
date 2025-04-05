import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  updateDoc,
  deleteDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyA7pX4H3NmMVUBJC2tYASX1uWcDRAJ7PmE",
    authDomain: "esystem-90a8a.firebaseapp.com",
    projectId: "esystem-90a8a",
    storageBucket: "esystem-90a8a.firebasestorage.app",
    messagingSenderId: "802455913459",
    appId: "1:802455913459:web:062d5288b217a297bbc886"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Referencias a colecciones
const registroRef = collection(db, 'RegistroLaboral');
const empleadoRef = collection(db, 'Empleados');

// Funciones de Firebase
export const guardarRegistro = async (employed_id, input_work, output_work, status, fecha) => {
    await addDoc(registroRef, { 
        employed_id, 
        input_work, 
        output_work, 
        status,
        fecha 
    });
}

export const obtenerEmpleado = async (dni) => {
    const q = query(empleadoRef, where("employed_id", "==", dni));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs[0]?.data();
}

export const obtenerRegistrosPorFecha = async (dni, fecha) => {
    const q = query(
        registroRef, 
        where("employed_id", "==", dni),
        where("fecha", "==", fecha)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export const obtenerTodosEmpleados = async () => {
    const querySnapshot = await getDocs(empleadoRef);
    return querySnapshot.docs.map(doc => doc.data());
}

export const onGetEmpleados = (callback) => onSnapshot(empleadoRef, callback);

export { db, doc, deleteDoc };