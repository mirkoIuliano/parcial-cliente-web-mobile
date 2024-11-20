// este archivo va a contener todo lo que tenga que ver con el manejo del chat público

// Clase 5 agregamos las siguientes importaciones para poder guardar los mensajes en la base de datos
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore"
import { db } from "./firebase" // importamos la variable db que creamos en firebase. Esta es la referencia a la base y la necesitamos para poder escribir o leer datos de la base 


// Esto que sigue es un JSDoc. JSDoc es un standar de documentación para estructuras de JS.
// Cuando hablamos de estructuras nos referimos a denición de: clases, funciones, variables
// En este caso nos sirve para documentar lo que hace esta función
/**
 * Graba un mensaje del chat público en el backend.
 * 
 * @param {{email:string, text: string}} newMessage
 * @returns {Promise} 
 * 
 */

// creamos la función para guardar mensajes
export async function savePulicChatMessage({email, text}) // pedimos que como argumentos que nos pasen un objeto, que vamos a separar en email y text
    /*
    Explicación de ({email, text}):
    Cuando ponemos como argumento un objeto con dos propiedades como {email, text} lo que estamos haceindo es lo mismo que a continución:
        export async function savePulicChatMessage(newMessage){
            const email = newMessage.email
            const text = newMessage.text
        }
    Estamos destructurando el objeto newMessage, pero dentro del paréntesis donde vienen los arguemntos. 
    Esto lo hacemos porque newMessage puede tener virutalmente infinidad de propiedades, pero a nosotros solo nos interesan esas dos. Entonces, cuando se invoca a esta función y se le pasa como arguemnto un objeto => savePulicChatMessage(newMessage); de este newMessage solo se va a tomar el email y el text
    */
{
    // Escribimos en Firestore
    // Para interactuar con una collection o document de Firestore es necesario definir una referencia a dicha collection o document
    // Para las collection usamos la función "collection"
    // Para los documentos usamos la función "document" 
    const chatRef = collection(db, 'public-chat') // collection recibe dos parámetros: la conexión a la base (db) y el nombre/ruta de la collection
    
    // Para agregar un docuemnto a una collection, usamos la función addDoc, que recibe 2 arguemntos:
    // 1. La referencia de la collection    2. Un objeto con los datos
    // Este método retorna una promesa que se resuelve cuando termina de escrbir (cuando se confirma que se grabó) (En este caso que vamos a hacer no nos va a servir la promesa, pero quizá en un futuro sí)
    await addDoc(chatRef, // le pasamos la referencia al chat (chatRef)
        {   // le pasamos como segundo parámetro un objeto que contenga los mensajes del chat
            email, 
            text,
        // usamos la función serverTimestamp para guardar la fecha de creación.
        // Esta función deja indicado que queremos que cuando el registro se grabe en el servidor, se tome la fecha y la hora del servidor 
        created_at: serverTimestamp(), 
        }
    ) 
}





// creamos la función para obtener los mensajes de la base de datos
export async function subscribeToPublicChatMessages(callback) // va a recibir un callback como parámetro. Este callback lo ejecutamos dentro del onSnapshot
// que una función sea asíncrona es que obliga a la función a retornar una promesa. Si intentamos retornar un valor estático, ese valor se va a englobar en una promesa
// además las funciones asíncronas permiten usar el await
{
    // Para leer los documentos de la collection "public-chat" empezamos por crear la referencia
    const chatRef = collection(db, 'public-chat')
                    // collection es una función de firestore que nos permite obtener una referencia de una collection
                    // las referencias son necesarias para poder escribir o leer cualquier collection o documento 

    /*  CLASE 6
        Creamos un "query" (consulta) para traer los registros ordenados por fecha de creación
        En Firestore se crea una query con una función llamada "query", que recibe AL MENOS 2 parámetros: 
        1. Una referencia a una collection  2. Una o más instrucciones de ordenamiento, filtro o límite
    */
    const chatQuery = query(
        chatRef, // el primer parámetro es la referencia a la collection
        orderBy('created_at', // el segundo parámetro es el ordenamiento
            // 'desc' o 'asc' // se le puede agregar un segundo parámetro a orderBy() para ordenar descendente o ascendentemente. Por defecto es ascendente (de menor a mayor)
        )
    )

    // Primero hicimos la lectura usando la función getDocs()
    // getDocs() retorna una "fotografía" de los datos en el momento de lectura (pero no se actualiza cuando se actualiza la base de datos). 
    // Esta función recibe como argumento la referencia a una collection, y retorna una Promise, que se resuelve con un objeto que se llama QuerySnapshot (que es una clase de Firebase)
    /*    
        const snapshot = await getDocs(chatRef)
    */
    // console.log(snapshot) // esto sirve para ver lo de QuerySnapshot
    // snapshot es un QuerySnapshot que tiene dentro muchísimas cosas. Entre ellas está 'docs', que dentro tiene todos los valores recibidos de la base de datos
    
    // El QuerySnapshot por si solo no nos sirve mucho. Nosotros queremos los documents. Podemos pedirlos usando la propiedad "docs" del snapshot, que retorna un array de objetos QueryDocumentSnapshot.
    // Cada uno de esos objetos representa un docuemnto de la collection, y tiene una propiedad "id" que retorna el id del documento, y un método "data()" que nos retorna un objeto con los datos del documento
    /*
        messages.value = snapshot.docs.map(doc => { // hacemos un map, para transformar cada documento en un objeto que tenga un id, email y text
            return {
                id: doc.id,
                email: doc.data().email,
                text: doc.data().text,
            }
        })
    */

    // Para hacer la lectura en tiempo real usamos la función "onSnapshot()". onSnapshot se ejecuta cada vez que haya cambios en la base de datos
    // Esta función recibe 2 arguemntos:
    // 1. La referencia de la collection o una query  2. El callback a ejecutar cada vez que haya cambios en la base de datos. Este callback recibe como parámetro el QuerySnapshot
    onSnapshot(chatQuery, snapshot => { // cada vez que haya un cambio en la base de datos se ejecuta esta fucnión
        const newMessages = snapshot.docs.map(doc => { // hacemos un map, para transformar cada documento en un objeto que tenga un id, email y text
            return {
                id: doc.id,
                email: doc.data().email,
                text: doc.data().text,
            }
        })
        callback(newMessages) // ejecutamos la función que recibimos como parámetro, pasándole los mensajes ya transformados 
        // la función que recibimos fue function(newMessages) => messages.value = newMessages)
        // le estamos pasando newMessages como parámetro
        // messages.value = esto se refiere a la variable 'messages' del archivo Chat.vue, que es un array vacío que va a guardar todos los chats de la base de datos
    })

    /* CHATGPT
        1. onSnapshot
        onSnapshot es una función proporcionada por Firebase que escucha cambios en tiempo real en una base de datos. Cada vez que hay un cambio, ejecuta una función de callback con un parámetro llamado snapshot.
            - snapshot es un objeto que representa el estado actual de los documentos en la base de datos (o los resultados de una consulta).
            - Dentro de snapshot hay una propiedad docs, que es un array con todos los documentos (cada uno representado por un objeto QueryDocumentSnapshot).

        2. snapshot.docs.map
        map es un método de los arrays en JavaScript que se usa para transformar los elementos de un array en un nuevo array.
            - snapshot.docs: Es un array con todos los documentos.
            - .map(...): Itera sobre cada documento en snapshot.docs y crea un nuevo array llamado newMessages.
            - doc => { ... }: Es una arrow function que define cómo transformar cada elemento doc del array snapshot.docs.

        3. Arrow Function
        Una arrow function es una forma simplificada de escribir funciones en JavaScript. La sintaxis básica es:
            (param1, param2) => { 
                // Cuerpo de la función 
            }
        Si el cuerpo de la función solo devuelve algo, puedes omitir las llaves {} y la palabra clave return:
            (param1, param2) => valorDevuelto
            Ejemplo real:
            const doble = numero => numero * 2;
            // Lo mismo que:
            function doble(numero) { return numero * 2; }

        En el bloque que muestras:
            doc => { 
                return {
                    id: doc.id,
                    email: doc.data().email,
                    text: doc.data().text,
                }
            }
            - doc: Es el parámetro que representa cada elemento del array snapshot.docs.
            - El cuerpo { return { ... }; }: Devuelve un objeto con las propiedades id, email y text extraídas de doc.
        Equivalente con función clásica:
            snapshot.docs.map(function(doc) {
                return {
                    id: doc.id,
                    email: doc.data().email,
                    text: doc.data().text,
                }
            })

        4. El objeto transformado
        Cada documento (doc) de snapshot.docs es un objeto con métodos como:
            - doc.id: Obtiene el ID único del documento.
            - doc.data(): Retorna los datos del documento como un objeto.
        La transformación con map devuelve un array con objetos que tienen esta estructura:
            {
                id: "documento1",
                email: "ejemplo@email.com",
                text: "Hola, mundo!"
            }

        5. callback(newMessages)
        Después de transformar los documentos, se ejecuta la función callback que recibió como parámetro newMessages. Esto pasa el nuevo array transformado a la función que lo invocó, para que haga algo con esos mensajes.
    */
}