# 🔐 Configuración de Seguridad - s1mple_cloud

## ✅ Correcciones Implementadas

Se han implementado las siguientes correcciones de seguridad:

### 1. ✅ Autenticación con Tokens
- El endpoint `DELETE /api/bastian?all=true` ahora **requiere autenticación**
- Se usa un token Bearer en el header `Authorization`
- El token se configura mediante variable de entorno `ADMIN_API_TOKEN`

### 2. ✅ Rate Limiting
- **GET**: 60 peticiones por minuto
- **POST**: 10 peticiones por minuto
- **DELETE**: 5 peticiones por minuto
- Headers de respuesta incluyen información de rate limit

### 3. ✅ CORS Restringido
- Solo permite peticiones desde:
  - `https://s1mple.cloud` (producción)
  - `http://localhost:3000` (desarrollo)
  - `http://127.0.0.1:3000` (desarrollo)

### 4. ✅ Validación y Sanitización Mejorada
- Validación de formato de nombre (solo letras, espacios, acentos)
- Validación de formato de teléfono
- Sanitización de caracteres peligrosos
- Límites de longitud (nombre: 100 chars, teléfono: 20 chars)

### 5. ✅ Límites de Datos
- Máximo 10,000 apuestas
- Validación de tamaño de archivo JSON (máximo 10MB)
- Validación de estructura de datos

### 6. ✅ Headers de Seguridad
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

---

## 🚀 Configuración Inicial

### Paso 1: Generar Token de Autenticación

**Opción A: Usando OpenSSL**
```bash
openssl rand -hex 32
```

**Opción B: Usando Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Opción C: Usando PowerShell (Windows)**
```powershell
-join ((48..57) + (97..102) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

### Paso 2: Configurar Variable de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
ADMIN_API_TOKEN=tu_token_generado_aqui
```

**⚠️ IMPORTANTE**: 
- **NUNCA** subas el archivo `.env.local` al repositorio
- El archivo `.env.local` ya está en `.gitignore`
- Cambia el token si sospechas que ha sido comprometido

### Paso 3: Reiniciar la Aplicación

```bash
# Si usas PM2
npm run pm2:restart

# O si ejecutas directamente
npm run build
npm start
```

---

## 📝 Uso de la API con Autenticación

### Eliminar Todas las Apuestas (Requiere Autenticación)

```bash
curl -X DELETE "https://s1mple.cloud/api/bastian?all=true" \
  -H "Authorization: Bearer tu_token_aqui"
```

### Eliminar una Apuesta Específica (No requiere autenticación)

```bash
curl -X DELETE "https://s1mple.cloud/api/bastian?id=1234567890"
```

### Crear una Apuesta (No requiere autenticación, pero tiene rate limiting)

```bash
curl -X POST "https://s1mple.cloud/api/bastian" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "phone": "+595 981 123456",
    "date": "2025-12-25"
  }'
```

---

## 🔍 Verificación de Rate Limiting

Cuando se excede el límite de rate limiting, recibirás una respuesta `429 Too Many Requests`:

```json
{
  "error": "Demasiadas peticiones. Intenta más tarde."
}
```

Con headers:
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 2025-01-15T10:30:00.000Z
Retry-After: 60
```

---

## 🛡️ Mejores Prácticas de Seguridad

### 1. Rotar el Token Periódicamente
- Cambia el token cada 3-6 meses
- O inmediatamente si sospechas compromiso

### 2. Usar HTTPS en Producción
- Asegúrate de que tu servidor use HTTPS
- Los tokens se envían en headers, pero HTTPS los protege en tránsito

### 3. Monitorear Logs
- Revisa logs de acceso regularmente
- Busca patrones sospechosos (muchas peticiones DELETE, etc.)

### 4. Mantener Dependencias Actualizadas
```bash
npm audit
npm audit fix
```

### 5. Revisar Permisos de Archivos
```bash
# El archivo de datos debe tener permisos restrictivos
chmod 600 data/bastian_bets.json
chown usuario:usuario data/bastian_bets.json
```

---

## 🚨 Si Detectas Actividad Sospechosa

1. **Cambia el token inmediatamente**
   ```bash
   # Genera nuevo token
   openssl rand -hex 32
   # Actualiza .env.local
   # Reinicia la aplicación
   ```

2. **Revisa logs de acceso**
   ```bash
   tail -f /var/log/nginx/access.log | grep "DELETE.*bastian"
   pm2 logs s1mple-cloud
   ```

3. **Revisa el servidor por malware**
   ```bash
   bash detectar_malware.sh
   ```

4. **Bloquea IPs sospechosas** (si es necesario)
   - Usa firewall del servidor
   - O configura reglas en nginx

---

## 📊 Monitoreo Recomendado

### Script de Monitoreo Básico

Crea un script que revise logs periódicamente:

```bash
#!/bin/bash
# monitor_api.sh

LOG_FILE="/var/log/nginx/access.log"
ALERT_EMAIL="tu@email.com"

# Buscar peticiones DELETE sospechosas sin autenticación
SUSPICIOUS=$(grep "DELETE.*bastian.*all=true" "$LOG_FILE" | grep -v "Authorization" | tail -10)

if [ ! -z "$SUSPICIOUS" ]; then
    echo "⚠️ ALERTA: Peticiones DELETE sin autenticación detectadas"
    echo "$SUSPICIOUS"
    # Enviar email de alerta (requiere configuración de mail)
    # echo "$SUSPICIOUS" | mail -s "Alerta de Seguridad" "$ALERT_EMAIL"
fi
```

---

## ✅ Checklist Post-Implementación

- [ ] Token de autenticación generado y configurado
- [ ] Archivo `.env.local` creado con el token
- [ ] Aplicación reiniciada
- [ ] Probado endpoint DELETE con autenticación
- [ ] Verificado que rate limiting funciona
- [ ] Verificado que CORS está restringido
- [ ] Revisado logs por actividad sospechosa
- [ ] Permisos de archivos configurados correctamente
- [ ] Backup del archivo de datos realizado

---

**Última actualización**: $(date)
**Versión de seguridad**: 1.0.0

