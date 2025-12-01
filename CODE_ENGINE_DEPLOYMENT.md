# Despliegue en IBM Cloud Code Engine

Esta guía explica cómo configurar las variables de entorno para el despliegue del frontend en IBM Cloud Code Engine.

## Variables de Entorno en Code Engine

IBM Cloud Code Engine maneja dos tipos de variables de entorno:

### 1. Variables de Build (`--build-env`)
Estas variables se pasan durante el proceso de build de la imagen Docker. Son necesarias para las variables `NEXT_PUBLIC_*` que se incrustan en el bundle de JavaScript del cliente.

**Variables requeridas:**
- `NEXT_PUBLIC_BASE_URL` - Base path de la aplicación
- `NEXT_PUBLIC_IBM_COS_ENDPOINT` - Endpoint de IBM Cloud Object Storage para imágenes
- `NEXT_PUBLIC_GRAPHQL_API_URL` - URL del API GraphQL
- `NEXT_PUBLIC_COOKIE_DOMAIN` - Dominio para las cookies

### 2. Variables de Runtime (`--env`)
Estas variables están disponibles cuando la aplicación se ejecuta. Se usan para configuración del servidor y secretos.

**Variables requeridas:**
- `AUTH0_DOMAIN` - Dominio de Auth0
- `AUTH0_ISSUER_BASE_URL` - URL base del issuer de Auth0
- `AUTH0_CLIENT_ID` - Client ID de Auth0
- `AUTH0_CLIENT_SECRET` - Client Secret de Auth0
- `AUTH0_SECRET` - Secret para encriptar sesiones
- `AUTH0_SCOPE` - Scopes de Auth0 (ej: "openid profile email")
- `AUTH0_AUDIENCE` - Audience de Auth0
- `AUTH0_BASE_URL` - URL base de la aplicación para callbacks

## Configuración mediante CLI

### Opción 1: Usando el comando `ibmcloud ce app update`

```bash
ibmcloud ce project select --name uc-centinela-backend-prod

ibmcloud ce application update \
  --name uc-centinela-frontend-prod \
  --build-source https://github.com/UC-Centinela/uc-centinela-frontend \
  --build-strategy dockerfile \
  --build-env NEXT_PUBLIC_BASE_URL=/app \
  --build-env NEXT_PUBLIC_IBM_COS_ENDPOINT=https://s3.us-south.cloud-object-storage.appdomain.cloud \
  --build-env NEXT_PUBLIC_GRAPHQL_API_URL=https://api.example.com/graphql \
  --build-env NEXT_PUBLIC_COOKIE_DOMAIN=.example.com \
  --env AUTH0_DOMAIN=https://your-domain.auth0.com \
  --env AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com \
  --env AUTH0_CLIENT_ID=your-client-id \
  --env AUTH0_CLIENT_SECRET=your-client-secret \
  --env AUTH0_SECRET=your-secret \
  --env AUTH0_SCOPE="openid profile email" \
  --env AUTH0_AUDIENCE=https://your-api.enteldigital.io \
  --env AUTH0_BASE_URL=https://your-app.example.com
```

### Opción 2: Usando ConfigMaps y Secrets (Recomendado para producción)

#### Crear ConfigMap para variables de build

```bash
ibmcloud ce configmap create \
  --name frontend-build-env \
  --from-literal NEXT_PUBLIC_BASE_URL=/app \
  --from-literal NEXT_PUBLIC_IBM_COS_ENDPOINT=https://s3.us-south.cloud-object-storage.appdomain.cloud \
  --from-literal NEXT_PUBLIC_GRAPHQL_API_URL=https://api.example.com/graphql \
  --from-literal NEXT_PUBLIC_COOKIE_DOMAIN=.example.com
```

#### Crear Secret para variables de runtime

```bash
ibmcloud ce secret create \
  --name frontend-runtime-env \
  --from-literal AUTH0_DOMAIN=https://your-domain.auth0.com \
  --from-literal AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com \
  --from-literal AUTH0_CLIENT_ID=your-client-id \
  --from-literal AUTH0_CLIENT_SECRET=your-client-secret \
  --from-literal AUTH0_SECRET=your-secret \
  --from-literal AUTH0_SCOPE="openid profile email" \
  --from-literal AUTH0_AUDIENCE=https://your-api.enteldigital.io \
  --from-literal AUTH0_BASE_URL=https://your-app.example.com
```

#### Actualizar la aplicación usando ConfigMap y Secret

```bash
ibmcloud ce application update \
  --name uc-centinela-frontend-prod \
  --build-source https://github.com/UC-Centinela/uc-centinela-frontend \
  --build-strategy dockerfile \
  --build-env-from-configmap frontend-build-env \
  --env-from-secret frontend-runtime-env
```

## Configuración mediante la Consola Web

1. Ve a tu proyecto de Code Engine en la consola de IBM Cloud
2. Selecciona la aplicación `uc-centinela-frontend-prod`
3. Ve a la sección **"Variables de entorno"** o **"Environment variables"**
4. Agrega las variables de runtime en la sección de **Runtime environment variables**
5. Ve a la sección **"Build configuration"** o **"Configuración de build"**
6. Agrega las variables de build en la sección de **Build environment variables**

## Actualizar variables existentes

Para actualizar variables existentes:

```bash
# Actualizar ConfigMap
ibmcloud ce configmap update --name frontend-build-env \
  --from-literal NEXT_PUBLIC_GRAPHQL_API_URL=https://new-api.example.com/graphql

# Actualizar Secret
ibmcloud ce secret update --name frontend-runtime-env \
  --from-literal AUTH0_CLIENT_SECRET=new-secret

# Reiniciar la aplicación para aplicar cambios
ibmcloud ce application update --name uc-centinela-frontend-prod
```

## Verificar variables configuradas

```bash
# Ver variables de build
ibmcloud ce application get --name uc-centinela-frontend-prod --output json | jq '.spec.build.env'

# Ver variables de runtime
ibmcloud ce application get --name uc-centinela-frontend-prod --output json | jq '.spec.env'
```

## Notas importantes

1. **Variables NEXT_PUBLIC_***: Estas variables DEBEN estar disponibles durante el build porque se incrustan en el bundle de JavaScript. Si no están disponibles, el build fallará o tendrá valores `undefined`.

2. **Variables de runtime**: Las variables sin el prefijo `NEXT_PUBLIC_` pueden pasarse en runtime y estarán disponibles en el servidor de Next.js.

3. **Secrets**: Para información sensible (como `AUTH0_CLIENT_SECRET`, `AUTH0_SECRET`), siempre usa Secrets en lugar de ConfigMaps.

4. **Reinicio**: Después de actualizar variables de runtime, la aplicación se reiniciará automáticamente. Para variables de build, se necesita un nuevo build.

5. **GitHub Actions**: El workflow de GitHub Actions está configurado para usar secrets de GitHub Actions. Asegúrate de que todos los secrets estén configurados en tu repositorio.

## Troubleshooting

### El build falla con variables undefined
- Verifica que todas las variables `NEXT_PUBLIC_*` estén configuradas como `--build-env`
- Revisa los logs del build: `ibmcloud ce buildrun list`

### La aplicación no puede conectarse a Auth0
- Verifica que todas las variables de Auth0 estén configuradas como `--env`
- Revisa los logs de la aplicación: `ibmcloud ce application logs --name uc-centinela-frontend-prod`

### Variables no se actualizan
- Asegúrate de hacer un nuevo build si cambiaste variables de build
- Reinicia la aplicación después de cambiar variables de runtime



