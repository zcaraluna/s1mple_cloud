# 🧪 Cómo Probar las Notificaciones del Navegador

Guía rápida para probar que las notificaciones funcionan correctamente.

## 📋 Pasos para Probar

### Paso 1: Iniciar el servidor de desarrollo

```bash
npm run dev
```

O si ya está corriendo en producción:

```bash
npm run pm2:start
```

### Paso 2: Abrir la página

Abre tu navegador y ve a:
- **Desarrollo**: `http://localhost:3000/bastian`
- **Producción**: `https://s1mple.cloud/bastian`

### Paso 3: Activar las notificaciones

1. En la página, busca la sección **"Notificación de Nacimiento"**
2. Haz clic en el botón **"🔔 Activar notificaciones"**
3. Cuando el navegador pregunte, selecciona **"Permitir"** o **"Allow"**
4. Deberías ver el mensaje: **"✅ Notificaciones activadas"**

### Paso 4: Probar la notificación

Hay **dos formas** de probar:

#### Opción A: Botón de Prueba (Más Rápido) ✨

1. Una vez activadas las notificaciones, verás un botón **"🧪 Probar notificación"**
2. Haz clic en él
3. **¡Deberías ver una notificación inmediatamente!**

#### Opción B: Probar con el Formulario Completo

1. Haz clic en **"👶 Marcar que Bastian nació"**
2. Completa el formulario:
   - Selecciona una fecha (puede ser cualquier fecha, incluso del pasado)
   - Opcional: agrega hora, peso, altura
3. Haz clic en **"Mostrar notificación"**
4. **¡Deberías ver la notificación con todos los datos!**

## ✅ Qué Deberías Ver

### En el Navegador (Escritorio):

- Aparecerá una **notificación nativa del sistema operativo** (esquina de la pantalla)
- Título: **"🎉 ¡Bastian ha nacido!"** o **"🎉 ¡Notificación de prueba!"**
- Cuerpo con la información de fecha, hora, peso, altura

### En Móvil:

- Aparecerá una **notificación push** como cualquier otra app
- Se mostrará en la barra de notificaciones

## 🔍 Verificar que Funciona

### ✅ Si Funciona Correctamente:

- Verás la notificación aparecer en tu pantalla
- Oirás un sonido (si tu sistema lo permite)
- Sentirás vibración (en móviles)
- La notificación permanecerá hasta que la cierres

### ❌ Si No Funciona:

1. **"Tu navegador no soporta notificaciones"**
   - Usa Chrome, Firefox, Edge o Safari
   - Actualiza tu navegador a la última versión

2. **"Primero debes activar los permisos"**
   - Asegúrate de haber hecho clic en "Activar notificaciones"
   - Y haber seleccionado "Permitir" cuando el navegador preguntó

3. **"Notificaciones bloqueadas"**
   - Ve a la configuración de tu navegador
   - Busca "Permisos del sitio" o "Configuración de sitios"
   - Permite las notificaciones para este sitio específicamente

## 🛠️ Solución de Problemas

### Chrome/Edge:
1. Haz clic en el candado 🔒 junto a la URL
2. Ve a "Configuración de sitios"
3. Busca "Notificaciones"
4. Cambia a "Permitir"

### Firefox:
1. Haz clic en el candado 🔒 junto a la URL
2. Ve a "Más información"
3. Busca "Permisos" → "Notificaciones"
4. Cambia a "Permitir"

### Safari:
1. Safari → Preferencias → Sitios web
2. Busca "Notificaciones"
3. Permite para este sitio

## 📱 Probar en Móvil

### Android (Chrome/Firefox):
1. Abre la página en el navegador
2. Sigue los mismos pasos
3. Las notificaciones funcionarán normalmente

### iOS (Safari):
1. Las notificaciones solo funcionan si agregas la página a la pantalla de inicio
2. Ve a la página
3. Toca el botón "Compartir" → "Agregar a pantalla de inicio"
4. Abre la app desde la pantalla de inicio
5. Luego activa las notificaciones

## 💡 Tips

- **Prueba primero con el botón de prueba** (más rápido)
- **Las notificaciones funcionan incluso si cierras la pestaña** (en Chrome/Firefox)
- **En móvil**, asegúrate de no tener el "modo no molestar" activado
- **Si no funciona**, verifica que tu navegador esté actualizado

## 🎯 Prueba Rápida en 3 Pasos

1. ✅ Activa notificaciones → "🔔 Activar notificaciones"
2. ✅ Haz clic en → "🧪 Probar notificación"
3. ✅ ¡Deberías ver la notificación!

¡Listo! Si ves la notificación, todo está funcionando correctamente. 🎉




