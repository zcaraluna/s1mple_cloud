# 🔒 Análisis Exhaustivo de Seguridad - s1mple_cloud

## ⚠️ RESUMEN EJECUTIVO

Se han identificado **múltiples vulnerabilidades críticas** que podrían haber permitido la ejecución de código malicioso (xmrig, systemd-devd) en el servidor. Este documento detalla cada vulnerabilidad encontrada y los posibles vectores de ataque.

---

## 🚨 VULNERABILIDADES CRÍTICAS IDENTIFICADAS

### 1. **FALTA DE AUTENTICACIÓN/AUTORIZACIÓN EN ENDPOINTS API** ⚠️ CRÍTICA

**Ubicación**: `app/api/bastian/route.ts`

**Problema**:
- El endpoint `DELETE` permite eliminar **TODAS** las apuestas sin ningún tipo de autenticación
- Cualquier persona puede acceder a `DELETE /api/bastian?all=true` y borrar todos los datos
- No hay verificación de tokens, sesiones, o credenciales

**Código vulnerable**:
```184:195:app/api/bastian/route.ts
// DELETE - Eliminar una apuesta o todas las apuestas
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const all = searchParams.get('all') === 'true'

    // Si se solicita eliminar todas las apuestas
    if (all) {
      await writeBets([])
      return NextResponse.json({ success: true, message: 'Todas las apuestas han sido eliminadas' })
    }
```

**Vector de ataque**:
```bash
# Cualquiera puede ejecutar:
curl -X DELETE "https://s1mple.cloud/api/bastian?all=true"
```

**Impacto**: 
- Destrucción de datos
- Denegación de servicio
- Posible escalada si se combina con otras vulnerabilidades

---

### 2. **CORS Y SERVER ACTIONS CONFIGURADOS PARA CUALQUIER ORIGEN** ⚠️ ALTA

**Ubicación**: `next.config.js`

**Problema**:
```5:9:next.config.js
  experimental: {
    serverActions: {
      allowedOrigins: ['*'],
    },
  },
```

**Vector de ataque**:
- Cualquier sitio web puede hacer peticiones a tu API desde el navegador
- Permite ataques CSRF (Cross-Site Request Forgery)
- Facilita el robo de datos mediante scripts maliciosos en otros sitios

**Impacto**:
- Ataques CSRF
- Robo de datos mediante sitios maliciosos
- Ejecución de acciones no autorizadas desde terceros

---

### 3. **FALTA DE VALIDACIÓN Y SANITIZACIÓN EXHAUSTIVA DE ENTRADA** ⚠️ MEDIA-ALTA

**Ubicación**: `app/api/bastian/route.ts` (POST endpoint)

**Problema**:
- Los datos se validan mínimamente pero no se sanitizan completamente
- Solo se hace `.trim()` pero no se valida longitud máxima
- No hay protección contra inyección de caracteres especiales
- El `JSON.parse()` puede fallar si el archivo está corrupto, pero no hay manejo robusto

**Código vulnerable**:
```89:164:app/api/bastian/route.ts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, date } = body

    // Validaciones
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'El nombre es requerido' },
        { status: 400 }
      )
    }
    // ... más validaciones básicas ...
    
    const newBet: Bet = {
      id: Date.now().toString(),
      name: name.trim(),  // ⚠️ Solo trim, sin sanitización adicional
      phone: phone.trim(), // ⚠️ Solo trim, sin validación de formato
      date: date,
      timestamp: selectedDate.getTime(),
    }
```

**Vectores de ataque**:
- Inyección de datos muy largos (DoS por memoria)
- Caracteres especiales que podrían corromper el JSON
- Manipulación del archivo JSON directamente si hay acceso al sistema de archivos

---

### 4. **LECTURA/ESCRITURA DE ARCHIVOS SIN VALIDACIÓN DE INTEGRIDAD** ⚠️ MEDIA

**Ubicación**: `app/api/bastian/route.ts`

**Problema**:
```26:38:app/api/bastian/route.ts
async function readBets(): Promise<Bet[]> {
  try {
    await ensureDataDir()
    const fileContents = await fs.readFile(DATA_FILE, 'utf8')
    return JSON.parse(fileContents)  // ⚠️ Si el archivo está corrupto o contiene código, puede fallar
  } catch (error: any) {
    // Si el archivo no existe, retornar array vacío
    if (error.code === 'ENOENT') {
      return []
    }
    throw error
  }
}
```

**Vector de ataque**:
- Si un atacante tiene acceso al sistema de archivos (por ejemplo, a través de otra vulnerabilidad), puede modificar `bastian_bets.json` directamente
- Podría inyectar código malicioso en el JSON que se ejecute cuando se lea
- Aunque `JSON.parse()` es relativamente seguro, un archivo corrupto podría causar errores que expongan información

---

### 5. **FALTA DE RATE LIMITING** ⚠️ MEDIA

**Problema**:
- No hay límite en el número de peticiones por IP
- Permite ataques de fuerza bruta
- Permite ataques de denegación de servicio (DoS)

**Vectores de ataque**:
```bash
# Ataque de fuerza bruta para eliminar apuestas
for i in {1..1000}; do
  curl -X DELETE "https://s1mple.cloud/api/bastian?all=true"
done

# Spam de creación de apuestas
for i in {1..10000}; do
  curl -X POST "https://s1mple.cloud/api/bastian" \
    -H "Content-Type: application/json" \
    -d '{"name":"Spam'$i'","phone":"123","date":"2025-12-25"}'
done
```

---

### 6. **MODO ADMIN DÉBIL (CLIENT-SIDE)** ⚠️ BAJA (pero preocupante)

**Ubicación**: `app/bastian/page.tsx`

**Problema**:
```126:164:app/bastian/page.tsx
  // Detector de teclas para escribir "bastian" (modo admin)
  useEffect(() => {
    if (isAdminMode) return

    const targetWord = 'bastian'
    let currentSequence = ''

    const handleKeyPress = (e: KeyboardEvent) => {
      // Solo detectar si no está escribiendo en un input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      const key = e.key.toLowerCase()
      
      // Solo procesar letras
      if (key.length === 1 && /[a-z]/.test(key)) {
        // Agregar letra a la secuencia actual
        currentSequence += key
        
        // Mantener solo los últimos caracteres que podrían formar "bastian"
        if (currentSequence.length > targetWord.length) {
          currentSequence = currentSequence.slice(-targetWord.length)
        }

        // Verificar si coincide con "bastian"
        if (currentSequence === targetWord) {
          setIsAdminMode(true)  // ⚠️ Cualquiera puede activar el modo admin
          currentSequence = ''
        }
```

**Impacto**:
- Aunque es solo client-side, revela funcionalidad administrativa
- Cualquiera puede descubrir y usar el modo admin
- Podría combinarse con otras vulnerabilidades

---

### 7. **FALTA DE VALIDACIÓN DE TAMAÑO DE ARCHIVO JSON** ⚠️ MEDIA

**Problema**:
- No hay límite en el tamaño del archivo `bastian_bets.json`
- Un atacante podría crear miles de apuestas para llenar el disco
- Podría causar DoS por consumo de recursos

---

### 8. **EXPOSICIÓN DE INFORMACIÓN EN ERRORES** ⚠️ BAJA-MEDIA

**Problema**:
```175:180:app/api/bastian/route.ts
  } catch (error) {
    console.error('Error guardando apuesta:', error)
    return NextResponse.json(
      { error: 'Error al guardar la apuesta' },
      { status: 500 }
    )
  }
```

Aunque los errores no se exponen directamente al usuario, los logs podrían contener información sensible.

---

## 🎯 VECTORES DE ATAQUE IDENTIFICADOS

### Vector 1: Eliminación Masiva de Datos (Más Probable)
```bash
# Paso 1: Descubrir el endpoint (fácil, está en el código fuente)
# Paso 2: Ejecutar ataque
curl -X DELETE "https://s1mple.cloud/api/bastian?all=true"

# Resultado: Todos los datos eliminados
```

### Vector 2: Manipulación del Archivo JSON Directamente
Si el atacante tiene acceso al sistema de archivos (por ejemplo, a través de otra vulnerabilidad del servidor o acceso SSH comprometido):

1. Modificar `data/bastian_bets.json` directamente
2. Inyectar datos maliciosos
3. Corromper el archivo para causar errores

### Vector 3: Ataque CSRF desde Sitio Malicioso
```html
<!-- En un sitio malicioso -->
<script>
  fetch('https://s1mple.cloud/api/bastian?all=true', {
    method: 'DELETE'
  });
</script>
```

Debido a la configuración CORS abierta, esto podría ejecutarse desde cualquier sitio.

### Vector 4: DoS por Spam de Peticiones
```bash
# Crear miles de apuestas para llenar el disco
for i in {1..100000}; do
  curl -X POST "https://s1mple.cloud/api/bastian" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"Spam$i\",\"phone\":\"123\",\"date\":\"2025-12-25\"}"
done
```

### Vector 5: Inyección de Código a través de Archivo JSON Corrupto
1. Acceder al sistema de archivos (por otra vulnerabilidad)
2. Modificar `bastian_bets.json` con contenido malicioso
3. Esperar a que la aplicación lea el archivo
4. Si hay alguna evaluación de código, podría ejecutarse

---

## 🔍 CÓMO SE PUDO EJECUTAR XMRIG Y SYSTEMD-DEVD

Basado en las vulnerabilidades encontradas, las formas más probables son:

### Escenario 1: Acceso al Sistema de Archivos
1. **Vulnerabilidad inicial**: Falta de autenticación en DELETE permitió descubrir el endpoint
2. **Escalada**: Si hay otra vulnerabilidad en el servidor (SSH débil, panel de control vulnerable, etc.)
3. **Ejecución**: El atacante pudo:
   - Acceder al sistema de archivos
   - Descargar e instalar xmrig
   - Crear un servicio systemd malicioso (systemd-devd)
   - Ejecutar el minero

### Escenario 2: Inyección a través de Dependencias
- Revisar `package.json` y `package-lock.json` por dependencias comprometidas
- Verificar si hay scripts post-install maliciosos

### Escenario 3: Compromiso del Servidor Base
- El servidor podría estar comprometido a nivel de sistema operativo
- Revisar logs del sistema, procesos en ejecución, y servicios systemd

---

## 🛡️ RECOMENDACIONES DE SEGURIDAD URGENTES

### 1. **IMPLEMENTAR AUTENTICACIÓN INMEDIATAMENTE** 🔴 CRÍTICO
```typescript
// Agregar middleware de autenticación
export async function DELETE(request: NextRequest) {
  // Verificar token de autenticación
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !isValidToken(authHeader)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  // ... resto del código
}
```

### 2. **RESTRINGIR CORS** 🔴 CRÍTICO
```javascript
// next.config.js
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['https://s1mple.cloud'], // Solo tu dominio
    },
  },
}
```

### 3. **AGREGAR RATE LIMITING** 🟠 ALTA PRIORIDAD
- Implementar rate limiting por IP
- Usar librerías como `express-rate-limit` o `@upstash/ratelimit`

### 4. **VALIDACIÓN Y SANITIZACIÓN MEJORADA** 🟠 ALTA PRIORIDAD
```typescript
// Validar longitud máxima
if (name.length > 100) {
  return NextResponse.json({ error: 'Nombre muy largo' }, { status: 400 })
}

// Sanitizar entrada
const sanitizedName = name.trim().replace(/[<>\"']/g, '')
```

### 5. **VALIDAR TAMAÑO DE ARCHIVO** 🟡 MEDIA PRIORIDAD
```typescript
const MAX_BETS = 10000
if (bets.length >= MAX_BETS) {
  return NextResponse.json({ error: 'Límite de apuestas alcanzado' }, { status: 400 })
}
```

### 6. **AUDITORÍA Y MONITOREO** 🟡 MEDIA PRIORIDAD
- Implementar logging de todas las operaciones
- Monitorear accesos sospechosos
- Alertas para operaciones DELETE

### 7. **REVISAR SERVIDOR COMPLETAMENTE** 🔴 CRÍTICO
```bash
# Comandos para revisar el servidor:
ps aux | grep xmrig
ps aux | grep systemd-devd
systemctl list-units --type=service | grep -i devd
netstat -tulpn | grep LISTEN
crontab -l
```

### 8. **CAMBIAR TODAS LAS CREDENCIALES** 🔴 CRÍTICO
- Cambiar contraseñas SSH
- Rotar tokens de API
- Revisar claves de acceso

---

## 📋 CHECKLIST DE SEGURIDAD

- [ ] Implementar autenticación en todos los endpoints
- [ ] Restringir CORS a dominios específicos
- [ ] Agregar rate limiting
- [ ] Mejorar validación y sanitización
- [ ] Implementar límites de tamaño de datos
- [ ] Agregar logging y monitoreo
- [ ] Revisar y limpiar el servidor de malware
- [ ] Cambiar todas las credenciales
- [ ] Actualizar todas las dependencias
- [ ] Implementar WAF (Web Application Firewall)
- [ ] Configurar backups automáticos
- [ ] Revisar permisos de archivos y directorios

---

## 🔬 PRÓXIMOS PASOS DE INVESTIGACIÓN

1. **Revisar logs del servidor**:
   ```bash
   tail -f /var/log/nginx/access.log
   tail -f /var/log/nginx/error.log
   pm2 logs
   ```

2. **Buscar procesos maliciosos**:
   ```bash
   ps aux | grep -E "xmrig|systemd-devd|miner"
   ```

3. **Revisar servicios systemd**:
   ```bash
   systemctl list-units --type=service --all
   systemctl status systemd-devd
   ```

4. **Revisar crontab**:
   ```bash
   crontab -l
   cat /etc/crontab
   ```

5. **Revisar conexiones de red**:
   ```bash
   netstat -tulpn
   ss -tulpn
   ```

6. **Revisar archivos recientemente modificados**:
   ```bash
   find / -type f -mtime -7 -ls
   ```

---

**Fecha del análisis**: $(date)
**Analista**: Auto (AI Security Assistant)
**Nivel de riesgo general**: 🔴 **CRÍTICO**

