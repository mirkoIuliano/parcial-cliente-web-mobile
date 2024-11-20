// este archivo se encarga de la autenticación al iniciar sesión

import { onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth } from "./firebase";
import { getUserProfileByID, updateUserProfile } from "./user-profile";

// creamos una variable donde vamos a obtener los datos del usuario autenticado (si es que existe)
let loggedUser = {
    id: null,
    email: null,
    displayName: null,
    bio: null,
    career: null,
    fullyLoaded: false,
}

// definimos un array de observers
let observers = []

// Nos "suscribimos" a los cambios de la autenticación
onAuthStateChanged // onAuthStateChanged() recibe un callback que se ejecuta cada vez que hay un cambio en el estado de autenticación; en esencia: si paso de ser un usuario autenticado a uno no autenticado o al revés
(auth, async user => {
    if(user) {
        // si existe user, seteamos los valores de loggedUser con los datos del usuario
        loggedUser = {
            //  En el usuario de Firebase Authentication, el id se llama 'uid' (unic id)
            id: user.uid,
            email: user.email, 
            displayName: user.displayName, 
        }

        // Buscamos ahora el resto de datos del perfil. Estos otros datos se enceutnran en una collection, en el document respectivo del usuario
        getUserProfileByID(user.uid)
            .then(userProfile => { // userProfile es el objeto que recibimos como respuesta de la función getUserProfileByID
                loggedUser = { // loggedUser va a ser igual a:
                    ...loggedUser, // lo que ya tenía 
                    bio: userProfile.bio, // y le agregamos la bio
                    career: userProfile.career, // la carrera
                    fullyLoaded: true, // y le cambiamos el fullyLoaded a true
                }

                // Notificamos a todos los observers que la data está actulizada
                notifyAll()
            })

    } else {
        // si user no existe, entonces los valores del loggedUser vuelven a ser todos nulos porque significa que no hay un usuario autenticado 
        loggedUser = {
            id: null,
            email: null,
            displayName: null,
            bio: null,
            career: null,
            fullyLoaded: false,
        }
    }
    
    // Como cambiaron los datos de la autenticación notificamos a los observer
    notifyAll()
})
/* 
Dato: onAuthStateChanged() queda "suelto" en la raíz del proyecto y esto hace que cada vez que alguien importe este archivo auth.js se ejecuta automáticamente onAuthStateChanged().
    Tan pronto alguien importa este módulo para usar cualquiera de sus funciones, ya le dejamos especificado que vamos a necesitar suscribirnos a la autenticación de Firebase
    Clase 7 (27 de sep), min 36:00 dijo esto 
*/


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


/**
 * Esta es la función para editar mi perfil y poder ponerle un nombre de usuario, biografía y la carrera
 * 
 * @param {{displayNamem: string, bio: string, career: string}} data
 * @returns {Promise<null>} 
 */
export async function editMyProfile({displayName, bio, career}) {
    try {
        // Actualizamos el displayName en Authentication
        await updateProfile( // updateProfile recibe 2 parámetro: 
            auth.currentUser, // 1. El usuario autenticado
            { // 2. Los datos, que solo pueden ser el nombre del usuario y la URL de la foto 
                displayName
            }
        )
        // Info: updateProfile() es una función que permite actualizar los datos de un usuario, pero el profe nos mostró (clase 7, min 55) que solo se pueden actulizar dos datos: la foto de perfil y el nombre de usuario


        // Actualizamos el perfil del usuario en Firestore con la función 'updateUserProfile()' de nuestro archivo 'user-profile.js'
        updateUserProfile( // a updateUserProfile() le tenemos que pasar dos parámetros:
            loggedUser.id, // el id del usuario que queremos modificar
            { // un objeto con los datos que queremos editar
                displayName, bio, career
            }
        ) 


        // Actualizamos los datos locales de loggedUser y notificamos a los observers
        loggedUser = { // a loggedUser le estamos diciendo que:
            ...loggedUser, // sea igual a lo que ya tenía dentro (...loggedUser)
            displayName, // más el displayName
            bio, // más la bio
            career, // más la career
        }
        // llamaos al notifyAll() para notificar a todos los obervers de los cambios
        notifyAll()
    } catch (error) {
        console.error('[auth.js editMyProfile] Error al tratar de editar el perfil: ', error)
        throw error // creo que ponemos el 'throw error' porque cuando hacemos esto después podemos manejar el error en el componente
    }
}

// esta es la función para cerrar sesión
export async function logout() {
    await signOut(auth)
}


/*--------------------------------------------------------------------------------
| Patrón de Diseño: Observar
+---------------------------------------------------------------------------------
| Un patrón es algo que se repite.
| Un patrón de diseño es una solución común de aplicar a un determinado problema.
| Muchos de estos ya están "identificados" y se les asignaron un nombre.
+---------------------------------------------------------------------------------
| En esta ocsción  vamos a presentar el ptarón 'Observer'.
| Observer sirve para definir una relación de 1 a muchos, entre elementos del 
| sistema. 
| Por un lado, tenemos un elemento llamado el "subject" (sujeto), y por otro lado
| tenemos otros elementos llamados "observers" (obeservadores). Observers serían
| los muchos y el subject el 1.
| La idea es que los observers son elementos que están interesados en ser 
| notificados de cambios o sucesos ocurridos en el subject. Depende de qué sea el
| subject, estos pueden ser acontecimientos en el cilco de vida del sujeto o en
| cambios de sus valores.
|
| La idea de la implementación que vamos a aplicar es que el subject maneje la 
| mayor parte (generalmente en "observer" la mayor parte del trabajo del patrón 
| está resuelta por el sujeto; los observers son los que sacan provecho de esto 
| mayormente).
| El subject va a permitir, a través de una función, que los observers puedan
| "suscribirse" para recibir notificaciones, en nuestro caso, de los cambios en  
| la variable del usuario autenticado.
| Estos observers van a ser guardados en un array.
| Cada vez que se realice algún cambio en los datos de loggedUser, vamos a pedir 
| que se notifique a todos los observers suscritos.
| 
| Nota: Si bien el término más común para agregar un observer es "subscribe",  
| algunas implementaciones lo llaman "attach" o "listen".
| Esto sería un obsrever ===> elementHTML.addEventListener('click', function(){})
| 
+--------------------------------------------------------------------------------*/

// Vamos a crear 3 funciones que vamos a usar para implementar el observer:
/**
 * 
 * @param {Function} callback 
 */
export function subscribeToAuthChanges(callback){
    // pusheamos la función callback al array observers
    observers.push(callback)

    //Inmediatamente notificamos al callback los datos actuales del usuario autenticado 
    notify(callback)
}

/**
 * Ejecuta el callback pasándole una copia de los datos del usuario autenticado.
 * 
 * @param {Function} callback 
 */
function notify(callback){
    callback({...loggedUser}) // Es muy importante que le pasemos una COPIA y no la variable loggedUser en sí, porque si hacemos esto, la estamos pasando por referencia y esto puede abrir problmeas
}

/**
 * Esta función notifica a todos los observers.
 */
function notifyAll(){
    observers // como observers es un array usamos un forEach
    .forEach( // recorro el array con un forEach
        callback => notify(callback) // y a cada uno de los valores (que son todos callback) le pedimos que se los notifique 
    )
}
// notifyAll se tiene que ejecutar cada vez que alguien cambie los valores en loggedUser. Así que dentro de onAuthStateChanged agregamos esta función