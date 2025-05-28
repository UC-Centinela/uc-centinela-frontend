# Web Centinela

## Actualización

Para correr el código deben hacer lo siguiente:

```bash
docker build -t centinela-frontend .
```

Y luego

```bash
docker run -p 3000:3000 centinela-frontend
```

Para ejecutar la aplicación en el puerto 3000

## Descripción General

Este proyecto consta de dos servicios principales: `api` y `web`. Estos son orquestados utilizando Docker y se gestionan a través de un proxy inverso con NGINX. El servicio `api` se construye usando NestJs, mientras que `webs` usa el framework Next.js.

## Docker

Docker es una plataforma que se utiliza para desarrollar, enviar y ejecutar aplicaciones dentro de contenedores. En este proyecto, Docker nos permite encapsular nuestros servicios en entornos aislados, asegurando que se ejecuten de manera consistente en diferentes configuraciones.

### Compose

Compose es una herramienta para definir y ejecutar aplicaciones Docker con múltiples contenedores. Utilizamos `docker compose` para gestionar y orquestar nuestros servicios. Las configuraciones se definen en el archivo `compose.yml`.

## NGINX (aún sin implementar)

NGINX actúa como un proxy inverso que direcciona el tráfico a nuestros dos servicios. Escucha en el puerto 80 y, según la ruta del URL, reenvía las solicitudes al servicio apropiado. Esta configuración simplifica la gestión y potenciales problemas de CORS, haciendo que nuestros servicios parezcan como si se originaran del mismo dominio.

## Configuración del Proyecto

### Requisitos

- Docker & Docker Compose
- Node.js (para desarrollo fuera de Docker)

### Ejecutando los Servicios

Para poner en marcha todos los servicios:

#### 1. Clona este repositorio:

```bash
git clone https://github.com/UC-Centinela/uc-centinela-frontend.git
```

#### 2. Conseguir las variables de entorno

Aún sin implementar

#### 3. Navega al directorio raíz y ejecuta:

```bash
docker compose -f compose.yml up --build
```

Esto iniciará todos los servicios según lo definido en el archivo `compose.yml`.

#### 4. Ejecutar comandos

```bash
docker compose exec nombre_contenedor comando_a_ejecutar
```

Con `exec` podrán correr comandos dentro de cada contenedor para instalar dependencias, formatear código o lo que sea necesario. Los más usados son:

```bash
docker compose exec nombre_contenedor npm i paquete_a_instalar
```

Si desean instalar un nuevo paquete en el package json del contenedor.

```bash
docker compose exec nombre_contenedor npm run prettier-format
```

Si desean/deben formatear el código con prettier.

### Accediendo a los Servicios

- **Web**: Navega a `http://localhost:3001`.

## Contribuciones

Si deseas contribuir, sigue los siguientes pasos:

1. **Creación de Ramas (Branching)**: Siempre crea una nueva rama para tus cambios. Los nombres de las ramas deben ser descriptivos y llevar un prefijo según el tipo de cambio que estés realizando:

- Características: `feat/nombre-de-tu-rama`
- Correcciones: `fix/nombre-de-tu-rama`
- Mejoras: `chore/nombre-de-tu-rama`
- Documentación: `docs/nombre-de-tu-rama`
- Pruebas: `test/nombre-de-tu-rama`

2. **Realiza tus Cambios**: Asegúrate de seguir la configuración de Prettier para el estilo del código, aunque estás se debería ver reflejadas de manera automática en cada commit.

3. **Commit y Push**: Una vez termines tus cambios, haz commit y push a tu fork.

4. **Abre una Pull Request**: Ve al repositorio original y abre una solicitud de extracción desde tu rama hacia development.
