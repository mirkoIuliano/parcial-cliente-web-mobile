// Este es el archivo de inicialización de Firebase y contiene las instrucciones de inicialización y clqra de los servicios de firebase que voy a querer utilizar. Acá vamos a venir par agregar Firestore, Authentication y Storage

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDmmH_T3Rn3KlTTACDAj3uZlVfJwslUav4",
    authDomain: "parcial-cliente-web-mobile.firebaseapp.com",
    projectId: "parcial-cliente-web-mobile",
    storageBucket: "parcial-cliente-web-mobile.firebasestorage.app",
    messagingSenderId: "384234701732",
    appId: "1:384234701732:web:ac02f14518c5769a5e7731"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// creamos la variable db, que inicia la conexión con Firestore y exporta la referencia a la base. Esta referencia va a ser necesaria para todas las acciones que yo quiero hacer contra la base de datos
export const db = getFirestore(app);


export const auth = getAuth(app)