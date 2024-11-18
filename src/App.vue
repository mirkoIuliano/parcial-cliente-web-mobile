<script setup>
//  dentro de script aca va la lógica del componente


</script>

<template>
<!-- dentro de template acá va toda la semántica del componente, el HTML  -->
    <nav class="navbar">
        <router-link to="/" class="brand">DV Social</router-link>
        <ul class="main-menu">
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/chat">Chat</router-link></li>
            <li><router-link to="/registrarse">Crear Cuenta</router-link></li>
            <li><router-link to="/iniciar-sesion">Iniciar Sesión</router-link></li>
        </ul>
    </nav>

    <main class="content">
        <!-- tenemos que usar el componente de router-view, que indica dónde el compontente se tiene que renderizar -->
        <router-view></router-view>
    </main>

    <footer class="footer">
        <p>Copyright © Da Vinci 2024</p>
    </footer>

</template>

<style>
/* dentro de style acá va toda la estilización del componente  */

</style>