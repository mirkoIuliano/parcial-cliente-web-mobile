<script setup>
import { onMounted, ref } from 'vue';
import { subscribeToAuthChanges } from '../services/auth';
import BaseHeading1 from '../components/BaseHeading1.vue';

const loggedUser = ref({
    id: null,
    email: null,
    displayName: null,
    bio: null,
    career: null,
})

onMounted(() => {
    // cuando se monte queremos llamar al subscribeToAuthChanges
    subscribeToAuthChanges(newUserData => loggedUser.value = newUserData)
})

</script>

<template>
    <div class="flex items-end gap-4">
        <BaseHeading1>Mi Perfil</BaseHeading1>
        <router-link 
            to="/mi-perfil/editar"
            class="mb-4 text-blue-700 underline"
        >Editar</router-link>
    </div>

    <div class="mb-4">{{ loggedUser.bio || "Acá va mi biografía..." }}</div>
    
    <dl>
        <dt class="font-bold">Email</dt>
        <dd class="mb-3">{{ loggedUser.email }}</dd>
        <dt class="font-bold">Nombre de Usuario</dt>
        <dd class="mb-3">{{ loggedUser.displayName || "No especificado..." }}</dd>
        <dt class="font-bold">Carrera</dt>
        <dd class="mb-3">{{ loggedUser.career || "No especificada..." }}</dd>
    </dl>
    <!-- 
        La idea es que queremos que de cada usuario pueda especificar, a parte del email, un nombre de usuario, una biografía y una carreara. Como displayName, bio y career son datos opcionales le ponemos un default por si este dato no existe  
    -->
</template>