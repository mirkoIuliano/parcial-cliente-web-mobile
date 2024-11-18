<script setup>
import BaseButton from '../components/BaseButton.vue';
import BaseHeading1 from '../components/BaseHeading1.vue';
import { ref } from 'vue';

const messages = ref([
    {
        id: 1,
        email: "sara@za.com",
        text: "Hola que tal"
    },
    {
        id: 2,
        email: "pepe@trueno.com",
        text: "Todo bien, vos?"
    },
    {
        id: 3,
        email: "sara@za.com",
        text: "Todo perfecto, por salir"
    },
])

// esta variable va a capturar los datos de los inputs
const newMessage = ref({
    email: '',
    text: '',
})

function handleSubmit() {
    messages.value.push({
        id: messages.value.length + 1,
        // email: newMessage.value.email,
        // text: newMessage.value.text,
        ...newMessage.value, // esto es lo mismo que hacer las anteriores dos líneas pero resumido
        /* 
            El triple punto (...) se llama object spred operator
            Lo que hace es agregale al objeto messages todo lo que el value de newMessage tenga
            Lo vamos a usar mucho para mandar copias
            const copiaNewMessage = {...newMessage.value} // así copiaríamos el objeto
            const copiaMessage = [...messages.value] // así copiaríamos el array
        */

    });
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