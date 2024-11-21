// Archivo de creación y configuración del Router
import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import Chat from '../pages/Chat.vue';
import MyProfile from "../pages/MyProfile.vue";
import MyProfileEdit from "../pages/MyProfileEdit.vue";
// importamos subscribeToAuthChanges para poder saber si el usuario está o no autenticado (esto lo sabemos con subscribeToAuthChanges y sus observers)
import { subscribeToAuthChanges } from "../services/auth";

// Definimos las rutas
// En vue router uno trabja con un arhicvo de configración de rutas. Creamos un array de objetos de ruta. Estos objeto deberían tener al menos 2 propiedades: path (ruta) y el componente que queremos asociar
const routes = [
    {
        path:'/', 
        component: Home,
    },
    {
        path:'/iniciar-sesion', 
        component: Login,
    },
    {
        path:'/registrarse', 
        component: Register,
    },
    {
        path:'/chat', 
        component: Chat,
        // agregamos un campo 'meta' a las rutas que requieren autenticación
        meta: { // los campos meta son campos que le podemos agregar a cualquier ruta, para asignarles el valor que querramos
            requireAuth: true // el usuario va a necesitar estar autenticado para acceder a esta ruta
        }
    },
    {
        path:'/mi-perfil', 
        component: MyProfile,
        // agregamos un campo 'meta' a las rutas que requieren autenticación
        meta: { // los campos meta son campos que le podemos agregar a cualquier ruta, para asignarles el valor que querramos
            requireAuth: true // el usuario va a necesitar estar autenticado para acceder a esta ruta
        }
    },
    {
        path:'/mi-perfil/editar', 
        component: MyProfileEdit,
        // agregamos un campo 'meta' a las rutas que requieren autenticación
        meta: { // los campos meta son campos que le podemos agregar a cualquier ruta, para asignarles el valor que querramos
            requireAuth: true // el usuario va a necesitar estar autenticado para acceder a esta ruta
        }
    },
];


// Con esto podemos usar el createRouter para crear nuestro router
// createRouter() recibe un objeto con, por lo menos, dos propiedades que le vamos a querer declarar: rutas y history
const router = createRouter(
    {
        routes, // routes: routes, ===> es lo mismo cualquiera de las dos opciones

        // para history hay 2 opciones:
        // 1. createWebHashHistory()
            // Utiliza el hash (hash es el numeral: "#") de la url para marcar el hisotrial de la ruta. El hash es el id. Cuando está en la url este # lo que hace la página es buscar si existe un id con ese nombre y scrollea hasta esa parte. Esto es lo que se llama como ancla
            // Si agregamos un # en la url la página no refresca, solo nos lleva hasta ese lugar de la página
        // 2. createWebHistory()
            // Si usamos esta opción no muestra el #

        // Desde el punto de vista del SEO, createWebHistory es mucho mejor (min 1:25:00 explica por qué). Este es lejos la mejor opción si es que se puede usar
        // ¿Por qué de poder usarlo?
        // Porque para que funcione adecuadamente en una web, es necesario configurar el servidor de una manenra especial
        // Si podemos configurar nuestro servidor, entonces es mejor usar createWebHistory
        // Si no lo podemos configurar se rompe la página si se refresca la página (min 1:28:00 lo explica) 
        history: createWebHashHistory(),
        // history: createWebHistory(),
    }
)


// Nos suscribimos a los datos del usuario autenticado
let loggedUser = {
    id: null,
    email: null,
    displayName: null,
    bio: null,
    career: null,
}

// Creo que llamamos acá para poder ver si el usuario está autenticado o no y con esto permitir o no la navegación a cieras rutas
subscribeToAuthChanges(newUserData => loggedUser = newUserData)

// Agregamos que en cada navegación de ruta se verifique si la ruta requiere autenticación, y de así serlo, verifique si el usuario está autenticado. De no estarlo, lo mandamos al login.
router.beforeEach( // vamos a usar la función beforeEach(), que se ejecuta antes de cada navegación de ruta. beforeEach me pasa los objetos de la ruta a la que voy (to) y a la que vengo (from)
    (to, from) => {
        console.log("Verificando si el usuario tiene acceso a esta ruta: ", to)
        if (to.meta.requireAuth /* si la ruta a la que quiero entrar tiene como atributo meta requireAuth en true */ && loggedUser.id === null /* y el id del usuario autenticado es null (osea que no hay un usuario autenticado) */) {
            return { // entonces lo retornamos a inicar-sesion
                path: '/iniciar-sesion'
            }
        }

})


// exportamos el router
export default router;