// este archivo se encarga de la autenticación al iniciar sesión

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

export async function login({email, password}) {
    // Tratamos de autenticar usando la función signInWithEmailAndPassword(), que sirve para iniciar sesión con un email y password
    // Recibe 3 parámetros:
    // 1. La instancia de Authentication
    // 2. El email
    // 3. El password
    // Retorna una Promise que se resuelve con UserCredentials, y se rechaza si el login no es exitoso
    try { // como puede ser rechazado y fallar la autentificación lo hacemos dentro de un trycatch
        const user = await signInWithEmailAndPassword(auth, email, password) 
        console.log("Sesión iniciada con éxito", user)

    } catch (error) {
        console.error("[auth.js login] Error al tratar de iniciar sesión: ", error)
        throw error
    }
}