# Venefish 🐟

### Boilerplate para proyectos React TypeScript con Next.js, shadcn/ui, Tailwind y Firebase en Vercel!

> ¡Ahora usando el App Router de Next.js!

Este stack es 🔥 porque los proyectos pueden ser construidos y desplegados gratuitamente hasta que alcances los niveles superiores dentro de Vercel/Firebase, lo cual solo ocurre una vez que obtienes muchos DAUs (usuarios activos diarios).

- **Ve**rcel para la nube y despliegues automatizados
- **Ne**xt.js para un React mejorado
- **Fi**rebase para autenticación y base de datos (Firestore)
- **Sh**adcn y Tailwind para la UI/estilos

**¡Avísame si tienes alguna pregunta! ¡Buena suerte!**

## Configuración

1. Asegúrate de que tu proyecto de Firebase tenga la autenticación habilitada.
2. Obtén tu configuración pública de Firebase y pégala en `components\firebase-providers.tsx`.
3. `npm i` y `npm run dev`

Lo siguiente solo es necesario si deseas utilizar `firebase/admin` (no incluido en este proyecto por defecto).

1. Crea un nuevo archivo en el nivel raíz llamado `.env.local`.
2. Define una nueva variable allí llamada `FIREBASE_ADMIN_SDK`.
3. Obtén la clave privada de tu cuenta de servicio de Firebase, conviértela a string y asigna esa string a la variable anterior.
   > ej.: `FIREBASE_ADMIN_SDK={"type":"service_account","project_id":"sleeptoken",...}`

### Notas

- Puedes usar `api/test.ts` para convertir tu clave privada a string para que puedas usarla en el entorno.
- Necesitas definir la misma variable de entorno `FIREBASE_ADMIN_SDK` en Vercel.

**Creado por [⬡ Un Granito de Tierra, A.C.](https://ungranitodetierra.org)**

## Documentación Adicional

Este boilerplate proporciona una base sólida para construir aplicaciones web modernas utilizando las últimas tecnologías. A continuación, se detallan aspectos importantes del proyecto:

### Estructura del Proyecto

El proyecto está estructurado de la siguiente manera:

-   `app/`: Contiene las rutas y componentes de la aplicación Next.js (App Router).
    -   `layout.tsx`: Define el layout principal de la aplicación.
    -   `page.tsx`: Es la página principal de cada ruta.
    -   `[dynamic-route]`: Rutas dinámicas.
-   `components/`: Componentes reutilizables de React.
    -   `ui/`: Componentes de la interfaz de usuario basados en `shadcn/ui`.
    -   `providers/`: Proveedores de contexto (ej. Firebase).
-   `public/`: Archivos estáticos como imágenes y fuentes.
-   `styles/`: Estilos globales y configuraciones de Tailwind CSS.
-   `utils/`: Funciones de utilidad y helpers.
-   `types/`: Definiciones de tipos de TypeScript.
-   `messages/`: Traducciones para la internacionalización (i18n) con `next-intl`.

### Tecnologías Clave

-   **Next.js:** Framework de React para construir aplicaciones web con renderizado del lado del servidor (SSR) y generación de sitios estáticos (SSG). Utiliza el nuevo App Router.
-   **TypeScript:** Lenguaje de programación que añade tipado estático a JavaScript.
-   **shadcn/ui:** Conjunto de componentes de interfaz de usuario reutilizables y personalizables.
-   **Tailwind CSS:** Framework de CSS de utilidad-primera para un desarrollo rápido y flexible.
-   **Firebase:** Plataforma de desarrollo de aplicaciones con servicios de autenticación, base de datos (Firestore) y más.
-   **Vercel:** Plataforma de despliegue en la nube optimizada para Next.js.
-   **next-intl:** Librería para la internacionalización (i18n).
-   **nuqs:** Librería para la gestión del estado en la URL (query parameters).

### Uso de Firebase

Para utilizar Firebase en este proyecto, sigue estos pasos:

1.  **Crear un proyecto en Firebase:**
    -   Ve a la [consola de Firebase](https://console.firebase.google.com/) y crea un nuevo proyecto.
2.  **Configurar la autenticación:**
    -   Habilita los métodos de autenticación que desees (por ejemplo, correo electrónico/contraseña, Google, etc.).
3.  **Obtener la configuración pública:**
    -   Ve a la configuración del proyecto y copia el objeto de configuración pública de Firebase.
4.  **Pegar la configuración en `components/firebase-providers.tsx`:**
    -   Reemplaza el objeto de configuración existente con el que copiaste de Firebase.

### Variables de Entorno

Es importante configurar las variables de entorno correctamente para que la aplicación funcione correctamente.

-   `FIREBASE_ADMIN_SDK`: Necesaria para usar `firebase/admin`. Debe contener la clave privada de la cuenta de servicio de Firebase en formato string.

### Despliegue en Vercel

Para desplegar este proyecto en Vercel, sigue estos pasos:

1.  **Crear una cuenta en Vercel:**
    -   Ve a [Vercel](https://vercel.com/) y crea una cuenta.
2.  **Conectar tu repositorio de Git:**
    -   Conecta tu repositorio de GitHub, GitLab o Bitbucket a Vercel.
3.  **Configurar las variables de entorno:**
    -   Asegúrate de definir la variable de entorno `FIREBASE_ADMIN_SDK` en la configuración del proyecto en Vercel.
4.  **Desplegar el proyecto:**
    -   Vercel detectará automáticamente que es un proyecto de Next.js y lo desplegará.

### Optimización

-   **Web Vitals:** Optimiza LCP (Largest Contentful Paint), CLS (Cumulative Layout Shift) y FID (First Input Delay) para una mejor experiencia de usuario.
-   **Imágenes:** Utiliza formatos de imagen optimizados (WebP), incluye información de tamaño y implementa carga diferida (lazy loading).
-   **'use client':** Minimiza el uso de 'use client', 'useEffect' y 'setState'. Favorece los componentes del servidor de React (RSC).
    -   Utiliza `Suspense` para envolver componentes del cliente y mostrar un fallback mientras cargan.
    -   Carga dinámica (`dynamic()`) para componentes no críticos.

### Internacionalización (i18n)

-   Utiliza `next-intl` para la localización de textos en todo el proyecto.
-   El idioma predeterminado es el español, con el inglés como segundo idioma.
-   Los archivos de traducción se encuentran en `messages/`.

### Convenciones Clave

-   Utiliza `nuqs` para la gestión del estado de los parámetros de búsqueda de la URL.
-   Sigue las convenciones de Next.js para la obtención de datos, el renderizado y el enrutamiento (App Router).
    -   `getServerSideProps` (SSR)
    -   `getStaticProps` (SSG)
    -   `getStaticPaths` (para rutas dinámicas con SSG)
-   **Patrones de Código:**
    -   Componentes funcionales con TypeScript.
    -   Hooks personalizados para lógica reutilizable (ej. `useAuth`).
    -   Estilo "utility-first" con Tailwind CSS.
-   **Convenciones de Nombres:**
    -   `camelCase` para variables, funciones, hooks y propiedades.
    -   `PascalCase` para componentes y tipos.
    -   `kebab-case` para nombres de archivos y directorios.

### Estilos y Temas

-   `tailwind.config.ts`: Configuración de Tailwind CSS, incluyendo temas personalizados y variantes.
-   `app/globals.css`: Estilos globales de la aplicación.
-   `shadcn/ui`: Componentes de interfaz de usuario reutilizables con estilos predefinidos.

### Patrones de Diseño

-   **Componentes:**
    -   Divide la interfaz de usuario en componentes pequeños y reutilizables.
    -   Utiliza props para pasar datos a los componentes.
    -   Utiliza `children` para componentes de layout.
-   **Hooks:**
    -   Encapsula la lógica reutilizable en hooks personalizados.
    -   Utiliza hooks de estado (`useState`) y de efecto (`useEffect`) para gestionar el estado y los efectos secundarios.
-   **Context:**
    -   Utiliza el Context API de React para compartir datos entre componentes sin necesidad de pasarlos manualmente a través de cada nivel del árbol.

### Próximos Pasos

-   Explora la documentación de Next.js, TypeScript, shadcn/ui, Tailwind CSS, Firebase, next-intl y nuqs para aprender más sobre estas tecnologías.
-   Comienza a construir tu aplicación utilizando este boilerplate como base.
-   Personaliza los estilos y componentes para adaptarlos a tus necesidades.
-   Implementa la lógica de tu aplicación utilizando los patrones y convenciones descritos en este documento.

¡Espero que esta documentación te sea útil! Si tienes alguna pregunta, no dudes en consultar.
