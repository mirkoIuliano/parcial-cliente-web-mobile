<script setup>
import { ref } from 'vue';
import BaseButton from '../components/BaseButton.vue';
import BaseHeading1 from '../components/BaseHeading1.vue';
import { register } from '../services/auth';


const user = ref({
    email: '',
    password: '',
})

// esta variable sirve para ser un estado de carga
const loading = ref(false)


async function handleSubmit(){
    // handleSubmit va a llamar a una función login, que está en el archivo auth.js

    loading.value = true

    try {
        await register({...user.value}) // llamamos a la función login() y le pasamos un objeto con los datos del user (osea los datos ingresados en el fomrulario)
    } catch (error) {
        console.error("[Register handleSubmit] Error al registrarse: ", error)
        // TODO: Manejar el error y mostrar un feedback
    }
}

</script>

<template>

    <BaseHeading1>Crear Cuenta</BaseHeading1>
    
    <form 
        action="#"
        @submit.prevent="handleSubmit"
    >

    <div class="mb-4">
        <label for="email" class="block mb-2">Email</label>
        <input 
            type="email" 
            id="email" 
            class="p-2 w-full border rounded"
            v-model="user.email"
        >
    </div>
    
    <div class="mb-4">
        <label for="password" class="block mb-2">Contraseña</label>
        <input 
            type="password" 
            id="password" 
            class="p-2 w-full border rounded"
            v-model="user.password"
        >
    </div>
    <BaseButton>Crear Cuenta</BaseButton>

    </form>
</template>