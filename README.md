# TaskApp - Gestión de Tareas

[![Estado del Proyecto](https://img.shields.io/badge/Estado-En%20Desarrollo-green)](https://github.com/euge/taskApp)
[![Licencia](https://img.shields.io/badge/Licencia-MIT-blue.svg)](LICENSE)

TaskApp es una aplicación móvil sencilla para crear, organizar y completar tareas.

Permite gestionar listas de tareas de forma rápida, con una interfaz clara y enfocada en la productividad diaria.

Incluye persistencia local y control dinámico de funcionalidades mediante configuración remota.

### 🤖 Android

<p align="left">
  <img src="medias/Android%20Simple.gif" width="250"/>
  <img src="medias/Android%20con%20Soporte%20de%20Categorias.gif" width="250"/>
</p>

---

### 🍏 iOS

<p align="left">
  <img src="medias/iOS%20Simple.gif" width="250"/>
  <img src="medias/iOS%20con%20Soporte%20de%20Categorias.gif" width="250"/>
</p>

## 📖 Tabla de Contenidos
- [✨ Funcionalidades](#-funcionalidades-implementadas)
- [🚩 Feature Flags (Remote Config)](#-feature-flags-remote-config)
- [🚀 Cómo ejecutar la aplicación](#-cómo-ejecutar-la-aplicación)
- [🔥 Configuración de Firebase](#-configuración-de-firebase)
- [⚙️ Modos de la Aplicación](#️-modos-de-la-aplicación)
- [🛠️ Tecnologías Utilizadas](#️-tecnologías-utilizadas)
- [🏗️ Arquitectura y Estructura](#️-arquitectura-del-proyecto)
- [⚡ Optimización de Rendimiento](#-optimización-de-rendimiento)
- [🧪 Calidad y Mantenibilidad](#-calidad-y-mantenibilidad)
- [🚀 Mejoras Potenciales](#-mejoras-potenciales)
- [❓ Preguntas y Respuestas](#-preguntas-y-respuestas)

---

## ✨ Funcionalidades Implementadas

*   **Gestión de Tareas:** Crear, completar y eliminar tareas.
*   **Gestión de Categorías:** Crear, editar y eliminar categorías personalizadas con colores.
*   **Filtrado:** Segmentación de tareas por categoría desde DB.
*   **Offline First:** Persistencia local garantizada con SQLite.
*   **Configuración Remota (Firebase):** 
    *   Habilitar/deshabilitar la gestión de categorías mediante el flag `enable_add_categories`.
    *   Alternar modos de visualización mediante el flag `add_tasks_with_category`.

---

## 🚩 Feature Flags (Remote Config)

Los siguientes parámetros controlan el comportamiento dinámico de la app:

*   **`add_tasks_with_category` (Boolean):**
    *   `true`: Activa la **Versión con Soporte de Categorías**. Habilita el filtrado, los chips de colores y el modal de creación.
    *   `false`: Activa la **Versión Simple**. Muestra el input directo en el home y oculta las funcionalidades de categorías.
*   **`enable_add_categories` (Boolean):**
    *   `true`: Permite al usuario acceder a la pantalla de "Gestión de Categorías" desde el modal de creación para añadir o editar sus propias categorías.
    *   `false`: Oculta la opción de gestión, limitando al usuario a usar las categorías predeterminadas o existentes.

---

## 🚀 Cómo ejecutar la aplicación

### Requisitos previos
* **Node.js**: Versión 18 o superior.
* **Ionic CLI**: `npm install -g @ionic/cli`.
* **Angular CLI**: `npm install -g @angular/cli`.

### Pasos para la instalación
1. Clona el repositorio.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configurar las variables de Firebase
4. Para ejecutar en el navegador (entorno de desarrollo):
   ```bash
   ionic serve
   ```
5. Para ejecutar en un dispositivo Android/iOS (requiere entorno Cordova configurado):
   ```bash
   # Agregar plataforma
   ionic cordova platform add android
   ionic cordova platform add ios
   
   # Ejecutar en Android
   ionic cordova run android
   
   # Ejecutar en iOS
   ionic cordova run ios
   ```

---

## 🔥 Configuración de Firebase

Para que la aplicación funcione correctamente, configura tus credenciales en `src/environments/environment.ts`:

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/).
2. Registra una app **Web**.
3. Habilita **Remote Config** y crea los parámetros:
   - `enable_add_categories` (Boolean)
   - `add_tasks_with_category` (Boolean)
4. Publica los cambios en Firebase.
5. Actualiza tu `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "...",
    authDomain: "...",
    projectId: "...",
    // ...resto de la config
  }
};
```

---

## ⚙️ Modos de la Aplicación

Gracias a la integración con Firebase Remote Config, la aplicación puede comportarse de dos formas distintas sin necesidad de reinstalar el código:

1.  **Versión Simple:** Orientada a la rapidez. El usuario visualiza un campo de texto directamente en la pantalla de inicio para agregar tareas de forma inmediata. En este modo, las tareas no utilizan categorías.
2.  **Versión con Soporte de Categorías:** Orientada a la organización. Se habilita un botón flotante que abre un creador de tareas avanzado. Aquí, el usuario puede asignar categorías, colores y gestionar su listado de forma segmentada.

---

## 🛠️ Tecnologías Utilizadas

*   **Framework:** [Ionic 8](https://ionicframework.com/)
*   **Lenguaje:** [Angular 20](https://angular.io/) / TypeScript
*   **Base de Datos:** [SQLite](https://cordova.apache.org/docs/en/latest/reference/cordova-sqlite-storage/) (Cordova Plugin)
*   **Backend Services:** [Firebase Remote Config](https://firebase.google.com/docs/remote-config)
*   **Testing:** Jasmine & Karma

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas
```text
src/app/
├── interactor/      # Casos de Uso (Lógica de Negocio)
├── repositories/    # Abstracciones/Contratos de datos
├── services/        # Implementaciones (SQLite, RemoteConfig)
├── models/          # Entidades (Interfaces)
├── home/            # UI y lógica de vista principal
└── categories/      # UI y lógica de categorías
```

La aplicación sigue los principios de **Arquitectura Limpia (Clean Architecture)**, dividiéndose en las siguientes capas:

### 1. Capa de Dominio (Models)
Contiene las interfaces puras de TypeScript (`Task`, `Category`).

### 2. Capa de Aplicación (Interactors / Use Cases)
Centraliza la lógica de negocio. Cada acción del usuario es un "Caso de Uso" independiente:
*   `CreateTaskUseCase`, `GetTasksUseCase`, `DeleteTaskUseCase`, etc.
*   **Beneficio:** Facilita las pruebas unitarias y la reutilización de lógica.

### 3. Capa de Infraestructura (Services / Repositories)
Implementa los detalles técnicos:
*   **Repositories:** Abstracciones (clases abstractas) que definen el contrato de datos.
*   **Database Service:** Implementación concreta usando SQLite.
*   **RemoteConfig Service:** Implementación de Firebase Remote Config.

### 4. Capa de Presentación (UI)
Componentes de Ionic/Angular que solo se encargan de mostrar datos y capturar eventos del usuario, delegando toda la lógica a los Casos de Uso.

---

## ⚡ Optimización de Rendimiento

Se aplicaron las siguientes técnicas para garantizar una aplicación fluida:

1.  **Paginación:** Las tareas se cargan en bloques (limit/offset) desde SQLite. Esto evita el uso excesivo de memoria RAM y reduce el tiempo de carga inicial.
2.  **Infinite Scroll:** Implementado para cargar más tareas a medida que el usuario hace scroll, mejorando la experiencia en listas largas.
3.  **Actualizaciones Optimistas (Optimistic UI):** Al agregar o eliminar tareas, la interfaz se actualiza localmente de inmediato sin esperar a la base de datos, manteniendo la posición de scroll y la fluidez.
4.  **Lazy Loading:** Todos los módulos se cargan bajo demanda para reducir el tamaño del paquete inicial (Bundle Size).

---

## 🧪 Calidad y Mantenibilidad

*   **Inyección de Dependencias:** Uso riguroso de DI para desacoplar componentes de implementaciones concretas.
*   **Pruebas Unitarias:** Se implementaron tests para todos los Casos de Uso utilizando Mocks para los repositorios, asegurando que la lógica de negocio funcione independientemente de la base de datos.
*   **Single Responsibility Principle:** Cada clase y componente tiene una única responsabilidad clara.

### Pruebas
Ejecuta las pruebas unitarias con:
```bash
npm test
```
Se han testeado todos los **Interactors** para asegurar la integridad de las reglas de negocio de forma aislada.

---

## 🚀 Mejoras Potenciales

A pesar de las optimizaciones realizadas, existen áreas donde la aplicación podría seguir evolucionando:

1.  **Caché Reactivo Completo:** Implementar un estado global (como NgRx o BehaviorSubjects en servicios) para que la UI reaccione instantáneamente a cambios en los datos sin ninguna consulta manual.
2.  **Sincronización en la Nube:** Añadir Firebase Firestore para que las tareas se sincronicen entre diferentes dispositivos del mismo usuario.
3.  **Recordatorios y Notificaciones:** Implementar notificaciones locales para recordar al usuario las tareas pendientes según una fecha/hora.
4.  **Modo Oscuro:** Adaptar los estilos SCSS para soportar el tema oscuro nativo del sistema operativo.
5.  **Búsqueda en Tiempo Real:** Añadir una barra de búsqueda que utilice operadores de SQLite para filtrar títulos de tareas instantáneamente.

---

## ❓ Preguntas y Respuestas

### ¿Cuáles fueron los principales desafíos que enfrentaste al implementar las nuevas funcionalidades?
El mayor desafío fue desacoplar el servicio de Base de Datos de la UI sin romper la funcionalidad existente. La implementación de la paginación junto con las actualizaciones optimistas requirió una lógica cuidadosa de "deduplicación" en el lado del cliente para evitar que elementos se repitieran al hacer scroll cuando se insertaban nuevos registros.

### ¿Qué técnicas de optimización de rendimiento aplicaste y por qué?
Apliqué **Paginación (Database)** e **Infinite Scroll (UI)** porque son las técnicas más efectivas para manejar el crecimiento de datos. Sin ellas, el rendimiento de la aplicación se degradaría linealmente con el uso del usuario.

### ¿Cómo aseguraste la calidad y mantenibilidad del código?
Aseguré la calidad mediante la separación de capas (Clean Architecture). Al obligar a que la UI dependa de Casos de Uso y estos de Abstracciones (Repositorios), el código se vuelve "autodocumentado" y extremadamente fácil de mantener o cambiar. Si mañana se decide cambiar SQLite por una API REST, el impacto en el código será mínimo.
