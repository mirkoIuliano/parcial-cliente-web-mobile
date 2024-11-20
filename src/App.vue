<script setup>
import { onMounted, ref } from 'vue';
import { logout, subscribeToAuthChanges } from './services/auth';
import { useRouter } from 'vue-router';

// vamos a obtener la instancia del router usando la función useRouter
const router = useRouter()

// creamos una variable donde vamos a obtener los datos del usuario autenticado (si es que existe)
const loggedUser = ref ({
    id: null,
    email: null,
})

onMounted(()=> {
    subscribeToAuthChanges(newUserData => loggedUser.value = newUserData)
    // esto sería lo mismo que poner:
    // subscribeToAuthChanges(function(newUserData) {loggedUser.value = newUserData})
})

function handleLogout(){
    logout()
    router.push('/iniciar-sesion') // usamos el método push para redireccionar a /iniciar-sesion
}
</script>

<template>
<!-- dentro de template acá va toda la semántica del componente, el HTML  -->
    <nav class="flex justify-between items-center p-4 bg-slate-300 text-slate-800">
        <router-link to="/" class="text-xl">DV Social</router-link>

        <ul class="flex gap-4 items-center">
            <li><router-link class="block py-1 px-2" to="/">Home</router-link></li>
            <!-- usamos v-if para hacer la verificación de si está o no el usuario con una sesión iniciada -->
            <template v-if="loggedUser.id !== null"> <!-- si loggedUser.id es distinto a null vamos a mostrar el Chat y Mi Perfil -->
                <!-- <template> es una etiqueta HTML. Dentro del <template> Vue recomienda que podemos usar template para agrupar múltiples instrucciones.
                En este caso nosotros queremos que cada uno de estos list se impriman si el usuario está autenticado
                No hay ninguna etiqueta HTML que podamos usar para "encerrar estos <li>" (Div no sería válido)
                La única alternativa que nos queda es poner en cada li el v-if así:
                <li v-if="loggedUser.id !== null"><router-link class="block py-1 px-2" to="/chat">Chat</router-link></li>
                Pero esto es muy engorroso
                Por eso, en este tipo de casos <template> es una etiqueta que tiene la característica, que es que no se renderiza; ya que sirve para definir bloques de código que se tienen que poder reutilizar e insertar en otro lado
                -->
                
                <li><router-link class="block py-1 px-2" to="/chat">Chat</router-link></li>
                <li><router-link class="block py-1 px-2" to="/mi-perfil">Mi Perfil</router-link></li>
                <li>
                    <form action="#" @submit.prevent="handleLogout">
                        <button type="submit">{{ loggedUser.email }} (Cerrar Sesión)</button>
                    </form>
                </li>
            </template>
            <!-- si no está -->
            <template v-else>
                <li><router-link class="block py-1 px-2" to="/registrarse">Crear Cuenta</router-link></li>
                <li><router-link class="block py-1 px-2" to="/iniciar-sesion">Iniciar Sesión</router-link></li>
            </template>
        </ul>

    </nav>

    <main class="p-4">
        <!-- tenemos que usar el componente de router-view, que indica dónde el compontente se tiene que renderizar -->
        <router-view></router-view>
    </main>

    <footer class="flex justify-center items-center bg-slate-800 text-white h-25">
        <p>Copyright © Da Vinci 2024</p>
    </footer>

</template>

<style>
/* dentro de style acá va toda la estilización del componente  */

</style>