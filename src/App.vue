<script setup>
//  dentro de script aca va la lógica del componente

//probando
</script>

<template>
<!-- dentro de template acá va toda la semántica del componente, el HTML  -->
    <nav class="flex justify-between items-center p-4 bg-slate-300 text-slate-800">
        <router-link to="/" class="text-xl">DV Social</router-link>

        <ul class="flex gap-4 items-center">
            <li><router-link class="block py-1 px-2" to="/">Home</router-link></li>
            <li><router-link class="block py-1 px-2" to="/chat">Chat</router-link></li>
            <li><router-link class="block py-1 px-2" to="/registrarse">Crear Cuenta</router-link></li>
            <li><router-link class="block py-1 px-2" to="/iniciar-sesion">Iniciar Sesión</router-link></li>
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