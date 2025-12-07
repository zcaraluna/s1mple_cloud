# 🌐 ¿Qué es CORS? Explicación Simple

## 📖 Concepto Básico

**CORS** significa **"Cross-Origin Resource Sharing"** (Intercambio de Recursos de Origen Cruzado).

Es una política de seguridad del navegador que controla **qué sitios web pueden hacer peticiones a tu API**.

---

## 🎯 ¿Por qué existe CORS?

Imagina este escenario:

1. **Tú estás en**: `https://s1mple.cloud` (tu sitio legítimo)
2. **Tu API está en**: `https://s1mple.cloud/api/bastian`
3. **Un atacante crea**: `https://sitio-malicioso.com` (sitio malicioso)

**Sin CORS**, el sitio malicioso podría:
- Hacer peticiones a tu API desde el navegador del usuario
- Robar datos
- Eliminar información
- Realizar acciones en nombre del usuario

**Con CORS**, el navegador pregunta: *"¿Este sitio tiene permiso para hacer peticiones a tu API?"*

---

## 🔍 Ejemplo Práctico en Tu Código

### Tu Frontend (app/bastian/page.tsx)

Cuando un usuario está en `https://s1mple.cloud/bastian` y hace clic en "Enviar apuesta", el código hace esto:

```typescript
const response = await fetch('/api/bastian', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: name.trim(),
    phone: phone.trim(),
    date: selectedDate,
  }),
})
```

**Origen**: `https://s1mple.cloud`  
**Destino**: `https://s1mple.cloud/api/bastian`  
**Resultado**: ✅ **Mismo origen** → Funciona sin problemas

---

## ⚠️ El Problema: CORS Abierto

### ❌ ANTES (Peligroso)

```javascript
// next.config.js
allowedOrigins: ['*']  // ⚠️ CUALQUIER sitio puede hacer peticiones
```

**Esto significa**:
- ✅ `https://s1mple.cloud` puede hacer peticiones
- ✅ `https://sitio-malicioso.com` puede hacer peticiones
- ✅ `https://cualquier-otro-sitio.com` puede hacer peticiones

### 🎯 Escenario de Ataque Real

Un atacante crea un sitio web malicioso:

```html
<!-- En https://sitio-malicioso.com -->
<script>
  // Este código se ejecuta cuando alguien visita el sitio malicioso
  fetch('https://s1mple.cloud/api/bastian?all=true', {
    method: 'DELETE'
  }).then(() => {
    alert('¡Eliminé todas las apuestas!')
  })
</script>
```

**Si CORS está abierto (`*`)**:
1. Usuario visita `https://sitio-malicioso.com`
2. El script malicioso se ejecuta automáticamente
3. Hace petición DELETE a tu API
4. **¡Todas las apuestas se eliminan!** 💥

**Con CORS restringido**:
1. Usuario visita `https://sitio-malicioso.com`
2. El script intenta hacer petición
3. El navegador pregunta: *"¿s1mple.cloud permite peticiones desde sitio-malicioso.com?"*
4. Tu servidor responde: *"No, solo permito s1mple.cloud"*
5. El navegador **bloquea la petición** ✅

---

## ✅ AHORA (Seguro)

```javascript
// next.config.js
allowedOrigins: [
  'https://s1mple.cloud',      // ✅ Tu sitio de producción
  'http://localhost:3000',     // ✅ Desarrollo local
  'http://127.0.0.1:3000',     // ✅ Desarrollo local (alternativo)
]
```

**Esto significa**:
- ✅ `https://s1mple.cloud` puede hacer peticiones
- ❌ `https://sitio-malicioso.com` **NO puede** hacer peticiones
- ❌ `https://cualquier-otro-sitio.com` **NO puede** hacer peticiones

---

## 🔄 Cómo Funciona CORS (Paso a Paso)

### 1. Petición Simple (GET)

```
Usuario en: https://s1mple.cloud
Hace: fetch('/api/bastian')

Navegador envía:
GET /api/bastian HTTP/1.1
Host: s1mple.cloud
Origin: https://s1mple.cloud  ← El navegador agrega esto automáticamente

Servidor responde:
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://s1mple.cloud  ← Tu servidor dice "sí, permitido"
Content-Type: application/json

[... datos ...]
```

### 2. Petición Compleja (POST, DELETE)

Para peticiones POST/DELETE, el navegador hace **dos peticiones**:

**Paso 1: Preflight (OPTIONS)**
```
OPTIONS /api/bastian HTTP/1.1
Host: s1mple.cloud
Origin: https://s1mple.cloud
Access-Control-Request-Method: DELETE

Servidor responde:
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://s1mple.cloud
Access-Control-Allow-Methods: GET, POST, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

**Paso 2: Petición Real (DELETE)**
```
DELETE /api/bastian?all=true HTTP/1.1
Host: s1mple.cloud
Origin: https://s1mple.cloud
Authorization: Bearer token123

Servidor responde:
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://s1mple.cloud
```

---

## 🎨 Visualización

```
┌─────────────────────────────────────────────────────────────┐
│                    NAVEGADOR DEL USUARIO                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Usuario visita: https://sitio-malicioso.com                │
│                                                              │
│  ┌──────────────────────────────────────────┐              │
│  │  Script malicioso intenta:                │              │
│  │  fetch('https://s1mple.cloud/api/...')   │              │
│  └──────────────────────────────────────────┘              │
│                    │                                         │
│                    ▼                                         │
│  ┌──────────────────────────────────────────┐              │
│  │  Navegador pregunta:                      │              │
│  │  "¿s1mple.cloud permite este origen?"    │              │
│  └──────────────────────────────────────────┘              │
│                    │                                         │
│                    ▼                                         │
└────────────────────┼─────────────────────────────────────────┘
                     │
                     │ Petición CORS
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    TU SERVIDOR                              │
│              https://s1mple.cloud                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Revisa: allowedOrigins = [                                │
│    'https://s1mple.cloud',                                 │
│    'http://localhost:3000'                                  │
│  ]                                                          │
│                                                              │
│  Origen recibido: 'https://sitio-malicioso.com'            │
│                                                              │
│  ❌ NO está en la lista permitida                           │
│                                                              │
│  Respuesta:                                                 │
│  Access-Control-Allow-Origin: null  (o no incluye header)  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                     │
                     │ Respuesta
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    NAVEGADOR                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  "El servidor NO permite este origen"                        │
│                                                              │
│  ❌ BLOQUEA la petición                                     │
│                                                              │
│  Error en consola:                                          │
│  "CORS policy: No 'Access-Control-Allow-Origin' header"    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Tipos de Peticiones CORS

### 1. **Peticiones Simples** (Siempre permitidas)
- GET
- HEAD
- POST (con Content-Type: text/plain, application/x-www-form-urlencoded, multipart/form-data)

### 2. **Peticiones Complejas** (Requieren preflight)
- POST (con Content-Type: application/json)
- DELETE
- PUT
- PATCH
- Cualquier método personalizado

---

## 🛡️ Por Qué Es Importante en Tu Proyecto

### Antes (Vulnerable):

```javascript
allowedOrigins: ['*']
```

**Riesgos**:
1. ❌ Cualquier sitio puede hacer peticiones DELETE
2. ❌ Ataques CSRF (Cross-Site Request Forgery)
3. ❌ Robo de datos
4. ❌ Eliminación no autorizada de información

### Ahora (Seguro):

```javascript
allowedOrigins: [
  'https://s1mple.cloud',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
]
```

**Protección**:
1. ✅ Solo tu sitio puede hacer peticiones
2. ✅ Previene ataques CSRF
3. ✅ Protege tus datos
4. ✅ Permite desarrollo local

---

## 🧪 Cómo Probar CORS

### Test 1: Desde tu sitio (debe funcionar)

Abre la consola del navegador en `https://s1mple.cloud`:

```javascript
fetch('https://s1mple.cloud/api/bastian')
  .then(r => r.json())
  .then(data => console.log('✅ Funciona:', data))
  .catch(err => console.error('❌ Error:', err))
```

**Resultado esperado**: ✅ Funciona

---

### Test 2: Desde otro sitio (debe fallar)

Abre la consola del navegador en `https://google.com` (o cualquier otro sitio):

```javascript
fetch('https://s1mple.cloud/api/bastian')
  .then(r => r.json())
  .then(data => console.log('✅ Funciona:', data))
  .catch(err => console.error('❌ Error:', err))
```

**Resultado esperado**: ❌ Error de CORS

```
Access to fetch at 'https://s1mple.cloud/api/bastian' 
from origin 'https://google.com' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

---

## 📝 Resumen

| Concepto | Explicación |
|----------|-------------|
| **¿Qué es?** | Política de seguridad que controla qué sitios pueden hacer peticiones a tu API |
| **¿Por qué?** | Previene que sitios maliciosos roben datos o realicen acciones no autorizadas |
| **¿Cómo funciona?** | El navegador pregunta al servidor si permite el origen, el servidor responde sí/no |
| **Tu caso** | Solo `s1mple.cloud` y `localhost` pueden hacer peticiones a tu API |

---

## 🎓 Analogía Simple

Imagina que tu API es una **fiesta privada**:

- **Sin CORS (`*`)**: Cualquiera puede entrar → ❌ Peligroso
- **Con CORS restringido**: Solo personas en la lista pueden entrar → ✅ Seguro

Tu lista ahora es:
- ✅ `https://s1mple.cloud` (tu sitio)
- ✅ `localhost:3000` (desarrollo)
- ❌ Todos los demás → **BLOQUEADOS**

---

**¿Tiene sentido ahora?** 🎯

