<script setup>
import BaseButton from '../components/BaseButton.vue';
import BaseHeading1 from '../components/BaseHeading1.vue';
import { onMounted, ref } from 'vue';
// Clase 5 agregamos las siguientes importaciones para poder guardar los mensajes en la base de datos
import { db } from '../servicres/firebase' // importamos la variable db que creamos en firebase. Esta es la referencia a la base y la necesitamos para poder escribir o leer datos de la base 
import { collection, addDoc, getDocs, onSnapshot } from 'firebase/firestore'; // importamos la función collection y addDoc


const messages = ref([])

// esta variable va a capturar los datos de los inputs
const newMessage = ref({
    email: '',
    text: '',
})

// Cuando se carge el componente, queremos leer los mensajes de Firestore. Para eso usamos onMounted, que es una función que se ejecuta cuando se monta el componente
onMounted(async() => { // onMounted recibe un callback   
    // que una función sea asíncrona es que obliga a la función a retornar una promesa. Si intentamos retornar un valor estático, ese valor se va a englobar en una promesa
    // además las funciones asíncronas permiten usar el await
    
    // Para leer los documentos de la collection "public-chat" empezamos por crear la referencia
    const chatRef = collection(db, 'public-chat')

    // Vamos a hacer la lectura usando la función getDocs()
    // getDocs() retorna una "fotografía" de los datos en el momento de lectura (pero no se actualiza cuando se actualiza la base de datos). 
    // Esta función recibe como argumento la referencia a una collection, y retorna una Promise que se resuelve con un objeto que se llama QuerySnapshot (que es una clase de Firebase)
    /*    
        const snapshot = await getDocs(chatRef)
    */
    // console.log(snapshot) // esto sirve para ver lo de QuerySnapshot
    // snapshot es un QuerySnapshot que tiene dentro muchísimas cosas. Entre ellas está 'docs', que dentro tiene todos los valores recibidos de la base de datos
    
    // El QuerySnapshot por si solo no nos sirve mucho. Nosotros queremos los documents. Podemos pedirlos usanod la propiedad "docs" del snapshot, que retorna un array de objetos QueryDocumentSnapshot.
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

    // Para hacer la lectura en tiempo real usamos la función onSnapshot
    // Esta función recibe 2 arguemntos:
    // 1. La referencia de la collection (o query)  2. El callback a ejecutar cada vez que haya cambios en la base de datos. Este callback recibe como parámetro el QuerySnapshot
    onSnapshot(chatRef, snapshot => { // cada vez que haya un cambio en la base de datos se ejecuta esta fucnión
        messages.value = snapshot.docs.map(doc => { // hacemos un map, para transformar cada documento en un objeto que tenga un id, email y text
            return {
                id: doc.id,
                email: doc.data().email,
                text: doc.data().text,
            }
        })
    })


})

function handleSubmit() {
    // Escribimos en Firestore
    // Para interactuar con una collection o document de Firestore es necesario definir una referencia a dicha collection o document
    // Para las collection usamos la función "collection"
    // Para los documentos usamos la función "document" 
    const chatRef = collection(db, 'public-chat') // collection recibe dos parámetros: la conexión a la base (db) y el nombre/ruta de la collection
    
    // Para agregar un docuemnto a una collection, usamos la función addDoc, que recibe 2 arguemntos:
    // 1. La referencia de la collection    2. Un objeto con los datos
    // Este método retorna una promesa que se resuelve cuando termina de escrbir (cuando se confirma que se grabó) (En este caso que vamos a hacer no nos va a servir la promesa, pero quizá en un futuro sí)
    addDoc(chatRef, // le pasamos la referencia al chat (chatRef)
        {...newMessage.value} // le pasamos como segundo parámetro un objeto que contenga los mensajes del chat
        /* 
            El triple punto (...) se llama object spred operator
            Lo que hace es agregale al objeto, todo lo que el value de newMessage tenga
            Lo vamos a usar mucho para mandar copias
            const copiaNewMessage = {...newMessage.value} // así copiaríamos el objeto
            const copiaMessage = [...messages.value] // así copiaríamos el array
        */
    ) 

    newMessage.value.text = ''; // cnd termina se borra el mensaje en el input pero dejamos el mail
}


</script>

<template>

    <BaseHeading1>Chat Público</BaseHeading1>

    <div class="flex gap-4">
        <section class="w-3/4">
            <h2 class="sr-only">Mensajes</h2> <!-- sr-only sirve para que solo sea visible para lectores de pantallas. La diferencia con "display:none" (class="hidden" en Taildwin) es que ninguno de los dos se ve visualmente, pero uno existe (sr-only) y el otro no (hidden). sr-only le deja 1px de height y 1px de width y después le pone marigin -1; entonces existe, pero no se ve. sr-only no se ve, pero sí lo detecta el lector de pantalla -->

            <div class="border rounded p-4 min-h-32">
                <!-- Acá se van a ir imprimiendo los mensajes del chat -->
                <ul class="flex flex-col gap-2 items-start">
                    <li v-for="message in messages" class="bg-gray-200 p-4 rounded">
                        <div><b>{{ message.email }}</b> dijo: </div>
                        <div>{{ message.text }}</div>
                    </li>
                </ul>
            </div>
        </section>

        <section class="w-1/4">
            <h2 class="text-2xl mb-4">Enviar un mensaje</h2>
            <form 
                action="#"
                @submit.prevent="handleSubmit"
            > <!-- no agregamnos method porque eso lo vamos a manejar con JS -->
                <div class="mb-4">
                    <label for="email" class="block mb-2">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        class="p-2 w-full border rounded"
                        v-model="newMessage.email"
                    >
                </div>
                <div class="mb-4">
                    <label for="text" class="block mb-2">Mensaje</label>
                    <textarea 
                        id="text" 
                        class="p-2 min-h-10 w-full border rounded" 
                        v-model="newMessage.text"
                    ></textarea>
                </div>
                <BaseButton
                    class="w-full"
                    color="green"
                >
                <!-- 
                <BaseButton
                    class="w-full" // de esta manera le pasamos una clase directamente y lo podemos hacer porque el compoenente BaseButton tiene un solo componente dentro de template
                    color="green" // de esta manera le pasamos una propiedad 
                >
                -->
                Enviar</BaseButton>
            </form>
        </section>
    </div>

</template>