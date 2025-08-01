# ContaPlus - Información de Producción

## 🌐 URL de Producción

**https://contaplus-managment.fly.dev/**

## 🚀 Estado del Despliegue

- ✅ **Aplicación**: Desplegada en Fly.io
- ✅ **Base de Datos**: Firebase Firestore
- ✅ **Autenticación**: Firebase Auth
- ✅ **Endpoints Públicos**: Funcionando

## 📱 Endpoints Públicos Disponibles

### 1. Información de Empresa

```
GET https://contaplus-managment.fly.dev/api/public/company/{companyId}
```

### 2. Productos de Empresa

```
GET https://contaplus-managment.fly.dev/api/public/company/{companyId}/products
```

### 3. Detalle de Producto

```
GET https://contaplus-managment.fly.dev/api/public/product/{productId}
```

## 🧪 Pruebas de los Endpoints

### Prueba con curl:

```bash
# Información de empresa (reemplaza {companyId} con un ID real)
curl https://contaplus-managment.fly.dev/api/public/company/{companyId}

# Productos de empresa
curl https://contaplus-managment.fly.dev/api/public/company/{companyId}/products

# Detalle de producto (reemplaza {productId} con un ID real)
curl https://contaplus-managment.fly.dev/api/public/product/{productId}
```

### Prueba en navegador:

1. Abre tu navegador
2. Ve a: `https://contaplus-managment.fly.dev/`
3. Inicia sesión como vendedor
4. Ve a "Mi Negocio"
5. Escanea el QR code generado

## 📋 Funcionalidades Disponibles

### Dashboard de Vendedor:

- ✅ **Productos**: CRUD completo
- ✅ **Ubicaciones**: CRUD completo
- ✅ **Promociones**: CRUD completo
- ✅ **Mi Negocio**: Información y QR code

### Endpoints Públicos:

- ✅ **Sin autenticación**: Accesibles desde cualquier dispositivo
- ✅ **Información filtrada**: Solo productos/ubicaciones/promociones activas
- ✅ **Estadísticas**: Incluidas en cada respuesta

## 🔧 Configuración Técnica

### Variables de Entorno Requeridas:

```env
FIREBASE_PROJECT_ID=contaplus-demo
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@contaplus-demo.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...
FIREBASE_DATABASE_URL=https://contaplus-demo-default-rtdb.firebaseio.com
NUXT_SESSION_PASSWORD=your-secret-password
```

### Tecnologías Utilizadas:

- **Frontend**: Nuxt.js 4 + Vue.js 3
- **Backend**: Nitro (Nuxt Server)
- **Base de Datos**: Firebase Firestore
- **Autenticación**: Firebase Auth
- **Despliegue**: Fly.io
- **QR Code**: qrcode library

## 📊 Monitoreo

### Logs Disponibles:

- 🔐 **Autenticación**: Logs de login/registro
- 🏢 **Empresa**: Logs de creación y consulta
- 📦 **Productos**: Logs de CRUD operations
- 📍 **Ubicaciones**: Logs de CRUD operations
- 🎯 **Promociones**: Logs de CRUD operations
- 🔓 **Endpoints Públicos**: Logs de acceso

### Métricas:

- **Uptime**: Monitoreado por Fly.io
- **Performance**: Logs de respuesta de API
- **Errores**: Logs detallados de errores

## 🛠️ Mantenimiento

### Comandos Útiles:

```bash
# Ver logs en tiempo real
fly logs

# Ver estado de la aplicación
fly status

# Reiniciar aplicación
fly deploy

# Ver variables de entorno
fly secrets list
```

### Actualizaciones:

1. Hacer cambios en el código
2. Commit y push a GitHub
3. Fly.io automáticamente hace deploy
4. Verificar en https://contaplus-managment.fly.dev/

## 📞 Soporte

### En caso de problemas:

1. **Verificar logs**: `fly logs`
2. **Revisar variables de entorno**: `fly secrets list`
3. **Reiniciar aplicación**: `fly deploy`
4. **Verificar Firebase**: Console de Firebase

### Contacto:

- **Desarrollador**: [Tu información de contacto]
- **Documentación**: API_ENDPOINTS.md
- **Repositorio**: [URL del repositorio]

---

**Última actualización**: Enero 2024
**Versión**: 1.0.0
**Estado**: ✅ Producción Activa
