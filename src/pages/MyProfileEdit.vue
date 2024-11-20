<script setup>
import { onMounted, ref } from 'vue';
import BaseHeading1 from '../components/BaseHeading1.vue';
import BaseButton from '../components/BaseButton.vue';
import { editMyProfile, subscribeToAuthChanges } from '../services/auth';

const loading = ref(false)

const editData = ref({
    displayName: '',
    bio: '',
    career: '',
})

const handleSubmit = async () => {
    loading.value = true;
    
    try {
        await editMyProfile({...editData.value}) // llamamos a la función editMyProfile y le pasamos una copia de mi usuario autenticado
    } catch (error) {
        // TODO: Manejar el error y mostrar un mensaje de feedback
    }
}

onMounted(()=> {
    // cuando monte queremos que traiga los datos del usuario autenticado para que en nuestro formulario de editar aparezcan los datos actuales, en vez de los input en blanco sin nada
    subscribeToAuthChanges(
        newUserData => editData.value = {
            displayName : newUserData.displayName,
            bio : newUserData.bio,
            career : newUserData.career,
        })

})

</script>

<template>
    <BaseHeading1>Editar Mi Perfil</BaseHeading1>

    <form 
        action="#"
        @submit.prevent="handleSubmit"
    >   
    <div class="mb-4">
        <label for="bio" class="block mb-2">Biografía</label>
        <textarea 
            id="bio" 
            class="p-2 min-h-10 w-full border rounded" 
            v-model="editData.bio"
        ></textarea>
    </div>
    <div class="mb-4">
        <label for="displayName" class="block mb-2">Nombre de Usuario</label>
        <input 
            type="text" 
            id="displayName" 
            class="p-2 w-full border rounded"
            v-model="editData.displayName"
        >
    </div>
    <div class="mb-4">
        <label for="career" class="block mb-2">Carrera</label>
        <input 
            type="text" 
            id="career" 
            class="p-2 w-full border rounded"
            v-model="editData.career"
        >
    </div>

    <BaseButton>Guardar Cambios</BaseButton>

    </form>
</template>