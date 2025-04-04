
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, onSnapshot, deleteDoc, doc, getDoc, updateDoc, query, where, orderBy, limit, setDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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
// Initialize Firebase
//export const app  = initializeApp(firebaseConfig);
//export const auth = getAuth(app);
export const db = getFirestore(app);

export const registroRef = collection(db, 'RegistroLaboral');
export const empleadoRef = collection(db, 'Empleados');

/*Save a New registro in Firestore con metodo addDoc() este metodo no necesita o requiere un id, la base de datos lo pone por defecto*/
export const guardarRegistro = (employed_id, input_work, output_work, status) => { addDoc(collection(db, 'RegistroLaboral'), { employed_id, input_work, output_work, status }) }
export const guardarEmpleados = (employed_id, names, surnames, birth, email, phone) => { addDoc(collection(db, 'Empleados'), { employed_id, names, surnames, birth, email, phone}) }

export const onGetRegistroLaboral = (callback) => onSnapshot(collection(db, 'RegistroLaboral'), callback)
export const onGetEmpleados = (callback) => onSnapshot(collection(db, 'Empleados'), callback)
//guardarRegistro("42231772","8:00 hr..","16:00 hr.",false);