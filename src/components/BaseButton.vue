<script setup>
// defineProps(['colors']) // defineProps puede recibir un array con el nombre de la propiedad

// o un objeto, donde la clave sea la propiedad y el valor fuera algunas configuraciones 
defineProps({
    color: {
        type: String, // le decimos que tiene que ser un String
        default: 'blue', // que por default es azul
        // inclusive podemos ponerle un validor para hacer que, por ejmeplo, Vue verifique que sea alguno de la lista de colores que yo quiero permitir

    }
})

</script>

<template>
    <button type="submit"
        class="transition-colors py-2 px-4 border rounded text-white"
        :class="{
            'bg-blue-700' : color == 'blue',
            'hover:bg-blue-500' : color == 'blue',
            'active:bg-blue-900' : color == 'blue',
            'bg-green-700' : color == 'green',
            'hover:bg-green-500' : color == 'green',
            'active:bg-green-900' : color == 'green',
            'bg-red-700' : color == 'red',
            'hover:bg-red-500' : color == 'red',
            'active:bg-red-900' : color == 'red',
        }"
        >
        <!-- si yo tengo una serie de clases que son fijas y otras que son dinámicas, Vue me permite trabjar con lo que se llama v-bind:class (que es lo mismo que poner solo :class)
        v-bind es la forma de poder pasar un valor que no sea simplemente un string a un atributo o propied -->
        <slot/></button>
</template>