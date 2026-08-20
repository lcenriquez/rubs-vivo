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
3. Copia `.env.example` a `.env.local` y completa las variables que necesites (ver [Variables de Entorno](#variables-de-entorno)).
4. `npm i` y `npm run dev`

Lo siguiente solo es necesario si deseas utilizar `firebase/admin` (no incluido en este proyecto por defecto).

1. En tu `.env.local`, define una variable llamada `FIREBASE_ADMIN_SDK`.
2. Obtén la clave privada de tu cuenta de servicio de Firebase, conviértela a string y asigna esa string a la variable anterior.
   > ej.: `FIREBASE_ADMIN_SDK={"type":"service_account","project_id":"sleeptoken",...}`

### Notas

- Puedes usar `api/test.ts` para convertir tu clave privada a string para que puedas usarla en el entorno.
- Necesitas definir la misma variable de entorno `FIREBASE_ADMIN_SDK` en Vercel.

## Envío de correos (Resend)

El proyecto incluye un cliente de [Resend](https://resend.com) en `lib/resend.ts` para el envío de correos transaccionales desde el dominio `antilabs.com.mx` (remitente por defecto: `rubs@antilabs.com.mx`).

1. Crea una cuenta en [Resend](https://resend.com) y genera una API key.
2. **Verifica el dominio `antilabs.com.mx`** en el [panel de dominios de Resend](https://resend.com/domains) agregando los registros DNS (SPF/DKIM) que te indique. Sin esto, los correos enviados desde `rubs@antilabs.com.mx` serán rechazados.
3. En `.env.local`, define:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxx
   RESEND_FROM_EMAIL="RUBS Vivo <rubs@antilabs.com.mx>"
   ```
4. Define las mismas variables en Vercel (Project Settings → Environment Variables).
5. Usa el helper `sendEmail()` desde código de servidor (Route Handlers, Server Actions o rutas de `pages/api`) — nunca lo importes desde un componente de cliente, ya que `RESEND_API_KEY` es secreta:

   ```ts
   import { sendEmail } from "@/lib/resend";

   await sendEmail({
     to: "destinatario@example.com",
     subject: "Asunto",
     html: "<p>Contenido del correo</p>",
   });
   ```

   `pages/api/send-test-email.ts` es un endpoint de ejemplo (`POST { "to": "..." }`) para verificar que la configuración funciona.

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

-   **Next.js 16** (React 19): Framework de React para construir aplicaciones web con renderizado del lado del servidor (SSR) y generación de sitios estáticos (SSG). Utiliza el App Router.
-   **TypeScript 5.9:** Lenguaje de programación que añade tipado estático a JavaScript.
-   **shadcn/ui:** Conjunto de componentes de interfaz de usuario reutilizables y personalizables.
-   **Tailwind CSS 3:** Framework de CSS de utilidad-primera para un desarrollo rápido y flexible.
-   **Firebase 12** (vía `reactfire`): Plataforma de desarrollo de aplicaciones con servicios de autenticación, base de datos (Firestore) y más.
-   **Resend:** Envío de correos transaccionales (ver [Envío de correos](#envío-de-correos-resend)).
-   **Vercel:** Plataforma de despliegue en la nube optimizada para Next.js.
-   **next-intl:** Librería para la internacionalización (i18n).
-   **nuqs:** Librería para la gestión del estado en la URL (query parameters).

### Actualización de dependencias (2026-08)

El stack se actualizó a las versiones estables más recientes de cada paquete (React 19, Next.js 16, Firebase 12, TypeScript 5.9, radix-ui, etc.) para cerrar vulnerabilidades conocidas en dependencias transitivas. Puntos a tener en cuenta:

-   **Tailwind CSS se mantuvo en la rama 3.x (LTS)** en lugar de saltar a la 4.x: la v4 cambia el formato de configuración (CSS-first) y requiere una migración visual que no se hizo en este cambio. Es un buen siguiente paso si se quiere seguir modernizando el proyecto.
-   **`reactfire` 4.2.6 no es compatible out-of-the-box con el renderizado en servidor de React 19** (le falta pasar `getServerSnapshot` a `useSyncExternalStore`, algo que React 19 exige en vez de solo advertir). Se aplicó un parche vía [`patch-package`](https://github.com/ds300/patch-package) (`patches/reactfire+4.2.6.patch`), que se reaplica automáticamente en cada `npm install` gracias al script `postinstall`. Si en el futuro `reactfire` publica un fix propio, este parche puede eliminarse.
-   `middleware.ts` se renombró a `proxy.ts`, que es la convención vigente en Next.js 16 (`middleware` quedó deprecado).
-   `next lint` fue removido en Next.js 16. El comando `npm run lint` ahora corre `eslint .` directamente con un `eslint.config.mjs` (flat config) basado en `eslint-config-next`. Esto expuso varias reglas nuevas de los lint rules de React Compiler (`react-hooks/set-state-in-effect`, `react-hooks/preserve-manual-memoization`, etc.) sobre patrones ya existentes en el código (por ejemplo, `setState` síncrono dentro de `useEffect` en `post-details-modal.tsx`, `search-location.tsx` y `posts-list.tsx`). No se refactorizó ese código como parte de esta actualización de dependencias; queda como buen siguiente paso.

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

Es importante configurar las variables de entorno correctamente para que la aplicación funcione correctamente. Usa `.env.example` como plantilla.

-   `FIREBASE_ADMIN_SDK`: Necesaria para usar `firebase/admin`. Debe contener la clave privada de la cuenta de servicio de Firebase en formato string.
-   `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Clave de la API de Google Maps, usada en `/map` para mostrar el mapa de baños registrados.
-   `RESEND_API_KEY`: API key de [Resend](https://resend.com) para el envío de correos transaccionales.
-   `RESEND_FROM_EMAIL`: Remitente de los correos (por defecto `RUBS Vivo <rubs@antilabs.com.mx>`). Requiere que el dominio `antilabs.com.mx` esté verificado en Resend.

### Despliegue en Vercel

Para desplegar este proyecto en Vercel, sigue estos pasos:

1.  **Crear una cuenta en Vercel:**
    -   Ve a [Vercel](https://vercel.com/) y crea una cuenta.
2.  **Conectar tu repositorio de Git:**
    -   Conecta tu repositorio de GitHub, GitLab o Bitbucket a Vercel.
3.  **Configurar las variables de entorno:**
    -   Define en Vercel las variables descritas en [Variables de Entorno](#variables-de-entorno) (`FIREBASE_ADMIN_SDK`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, según cuáles use tu despliegue).
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
