# ContaPlus Public API Endpoints

Estos endpoints son públicos y pueden ser accedidos desde cualquier dispositivo móvil escaneando el QR code generado en el dashboard.

## 📋 Información del QR Code

El QR code contiene un JSON con la siguiente estructura:

```json
{
  "companyId": "abc123",
  "userId": "user456",
  "companyName": "Mi Empresa",
  "userEmail": "vendedor@empresa.com",
  "endpoints": {
    "companyInfo": "https://contaplus.app/api/public/company/abc123",
    "products": "https://contaplus.app/api/public/company/abc123/products"
  }
}
```

## 🏢 Endpoints Disponibles

### 1. Información de la Empresa

**GET** `/api/public/company/{companyId}`

Obtiene información completa de la empresa incluyendo estadísticas básicas.

**Respuesta:**

```json
{
  "company": {
    "id": "abc123",
    "name": "Mi Empresa",
    "ruc": "12345678901",
    "corporateEmail": "info@miempresa.com",
    "phone": "+593 99 123 4567",
    "address": "Av. Principal 123, Quito",
    "industry": "Tecnología",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "owner": {
    "id": "user456",
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@miempresa.com",
    "telephone": "+593 99 123 4567"
  },
  "stats": {
    "totalProducts": 25,
    "totalLocations": 5,
    "activePromotions": 3
  }
}
```

### 2. Lista de Productos de la Empresa

**GET** `/api/public/company/{companyId}/products`

Obtiene todos los productos activos de la empresa con sus ubicaciones y promociones.

**Respuesta:**

```json
{
  "companyId": "abc123",
  "companyName": "Mi Empresa",
  "totalProducts": 25,
  "products": [
    {
      "id": "prod123",
      "name": "Laptop HP Pavilion",
      "sku": "TECH-LAP-001",
      "description": "Laptop de alta gama para trabajo",
      "category": "Tecnología",
      "price": 899.99,
      "stock": 15,
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "locations": [
        {
          "id": "loc123",
          "name": "Estante Principal",
          "zone": "A",
          "section": "Tecnología",
          "position": "A1-B2",
          "createdAt": "2024-01-15T10:30:00Z"
        }
      ],
      "promotions": [
        {
          "id": "promo123",
          "title": "Descuento 20%",
          "message": "Oferta especial en laptops",
          "discountType": "percentage",
          "discountValue": 20,
          "startDate": "2024-01-01T00:00:00Z",
          "endDate": "2024-01-31T23:59:59Z",
          "uses": 5
        }
      ],
      "stats": {
        "totalLocations": 1,
        "activePromotions": 1,
        "hasLowStock": false
      }
    }
  ]
}
```

### 3. Información Detallada de un Producto

**GET** `/api/public/product/{productId}`

Obtiene información detallada de un producto específico incluyendo ubicaciones y promociones.

**Respuesta:**

```json
{
  "product": {
    "id": "prod123",
    "name": "Laptop HP Pavilion",
    "sku": "TECH-LAP-001",
    "description": "Laptop de alta gama para trabajo",
    "category": "Tecnología",
    "price": 899.99,
    "stock": 15,
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "company": {
    "id": "abc123",
    "name": "Mi Empresa",
    "ruc": "12345678901",
    "phone": "+593 99 123 4567",
    "address": "Av. Principal 123, Quito"
  },
  "locations": [
    {
      "id": "loc123",
      "name": "Estante Principal",
      "zone": "A",
      "section": "Tecnología",
      "position": "A1-B2",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "promotions": [
    {
      "id": "promo123",
      "title": "Descuento 20%",
      "message": "Oferta especial en laptops",
      "discountType": "percentage",
      "discountValue": 20,
      "startDate": "2024-01-01T00:00:00Z",
      "endDate": "2024-01-31T23:59:59Z",
      "uses": 5,
      "status": "active",
      "isActive": true
    }
  ],
  "stats": {
    "totalLocations": 1,
    "activePromotions": 1,
    "upcomingPromotions": 0,
    "hasLowStock": false,
    "hasPromotions": true,
    "hasLocations": true
  }
}
```

## 📱 Uso en Aplicaciones Móviles

### Ejemplo de uso con JavaScript:

```javascript
// Escanear QR code y obtener datos
const qrData = JSON.parse(qrCodeContent);

// Obtener información de la empresa
const companyInfo = await fetch(qrData.endpoints.companyInfo);
const company = await companyInfo.json();

// Obtener productos de la empresa
const productsResponse = await fetch(qrData.endpoints.products);
const products = await productsResponse.json();

// Obtener información de un producto específico
const productDetail = await fetch(`/api/public/product/${productId}`);
const product = await productDetail.json();
```

### Ejemplo con React Native:

```javascript
import { Alert } from "react-native";

const handleQRScan = async (qrData) => {
  try {
    // Obtener información de la empresa
    const companyResponse = await fetch(qrData.endpoints.companyInfo);
    const company = await companyResponse.json();

    Alert.alert("Empresa Encontrada", `Bienvenido a ${company.company.name}`);

    // Navegar a la lista de productos
    navigation.navigate("Products", {
      productsUrl: qrData.endpoints.products,
    });
  } catch (error) {
    Alert.alert("Error", "No se pudo obtener la información");
  }
};
```

## 🔒 Seguridad

- Estos endpoints son **públicos** y no requieren autenticación
- Solo devuelven información de productos **activos**
- Solo muestran ubicaciones **activas**
- Solo incluyen promociones **activas**
- Los datos sensibles del propietario están limitados

## 📊 Estadísticas Incluidas

Cada endpoint incluye estadísticas relevantes:

- **Empresa**: Total de productos, ubicaciones y promociones activas
- **Productos**: Ubicaciones por producto, promociones activas, stock bajo
- **Producto Individual**: Estado de promociones, disponibilidad de ubicaciones

## 🚀 Implementación

Para implementar en tu aplicación móvil:

1. **Escanear QR**: Usar cualquier librería de QR code
2. **Parsear JSON**: Extraer los endpoints del QR
3. **Hacer requests**: Usar los endpoints para obtener información
4. **Mostrar datos**: Presentar la información de manera amigable

Los endpoints están optimizados para uso móvil y devuelven solo la información necesaria para una experiencia de usuario fluida.
