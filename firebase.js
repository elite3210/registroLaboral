
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
//creacion de la tabla o coleccion:
export const registroRef = collection(db, 'RegistroLaboral');
export const empleadoRef = collection(db, 'Empleados');
export const tarifasRef = collection(db, 'Tarifas');

/*Save a New registro in Firestore con metodo addDoc() este metodo no necesita o requiere un id, la base de datos lo pone por defecto*/
export const guardarRegistro = (employed_id, input_work, output_work, status) => { addDoc(collection(db, 'RegistroLaboral'), { employed_id, input_work, output_work, status }) }
export const guardarEmpleados = (employed_id, names, surnames, birth, email, phone) => { addDoc(collection(db, 'Empleados'), { employed_id, names, surnames, birth, email, phone}) }
export const guardarTarifa = (job_id, description_job, price_hour) => { addDoc(collection(db, 'Tarifas'), {job_id, description_job, price_hour}) }


//suscripcion tiempo real para consulta o vista de tabla
export const onGetRegistroLaboral = (callback) => onSnapshot(collection(db, 'RegistroLaboral'), callback)
export const onGetEmpleados = (callback) => onSnapshot(collection(db, 'Empleados'), callback)
export const onGetTarifas = (callback) => onSnapshot(collection(db, 'Tarifas'), callback)


/*metodo getDoc 'en singular' para traer un documento de firestore */
export const getOneEmployed          = (id)=>getDoc(doc(db,'Empleados',id))

//eliminar elemento del la coleccion:

export function deleteRegistroLaboral(id){
    deleteDoc(doc(db,'RegistroLaboral',id));
};

export function deleteEmployed(id){
    deleteDoc(doc(db,'Empleados',id));
};

//actualizar firebase:
export const updateEmployed    = (id,newFields)=>updateDoc(doc(db,'Empleados',id),newFields)
export const updateRegistroLaboral    = (id,newFields)=>updateDoc(doc(db,'RegistroLaboral',id),newFields)


