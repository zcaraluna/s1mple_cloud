# Configuración de HestiaCP para s1mple.cloud

## Problema identificado:
HestiaCP está configurando nginx para hacer proxy a Apache en el puerto 8080, pero necesitas que haga proxy a Next.js en el puerto 6367.

## Solución:

### ⚠️ IMPORTANTE: No usar nginx.conf_custom (causa error de location duplicado)

HestiaCP ya define `location /` en nginx.conf, por lo que no puedes duplicarlo.

### Opción 1: Usando script automático (Recomendado)

Ejecuta el script que modifica directamente nginx.conf:

```bash
chmod +x fix-nginx-hestiacp.sh
./fix-nginx-hestiacp.sh
```

Este script:
- Hace backup automático antes de modificar
- Cambia `proxy_pass` de puerto 8080 (Apache) a 6367 (Next.js)
- Verifica la sintaxis
- Recarga nginx automáticamente

### Opción 2: Modificación manual (si el script no funciona)

HestiaCP incluye automáticamente archivos que terminan en `_custom` o `_letsencrypt`.

1. **Copiar la configuración personalizada:**
```bash
sudo cp nginx-custom-s1mple-cloud.conf /home/bitcanc/conf/web/s1mple.cloud/nginx.conf_custom
```

2. **Verificar permisos:**
```bash
sudo chown root:bitcanc /home/bitcanc/conf/web/s1mple.cloud/nginx.conf_custom
sudo chmod 640 /home/bitcanc/conf/web/s1mple.cloud/nginx.conf_custom
```

3. **Probar configuración de nginx:**
```bash
sudo nginx -t
```

4. **Recargar nginx:**
```bash
sudo systemctl reload nginx
```

### Opción 2: Modificar directamente nginx.conf (se puede perder al reconstruir)

**NO RECOMENDADO** pero funciona:

```bash
# Hacer backup primero
sudo cp /home/bitcanc/conf/web/s1mple.cloud/nginx.conf /home/bitcanc/conf/web/s1mple.cloud/nginx.conf.backup

# Editar el archivo
sudo nano /home/bitcanc/conf/web/s1mple.cloud/nginx.conf
```

Cambiar las líneas:
- `proxy_pass http://64.176.18.16:8080;` → `proxy_pass http://127.0.0.1:6367;`

## Verificación:

1. **Probar desde el servidor:**
```bash
curl http://127.0.0.1:6367
curl http://s1mple.cloud
```

2. **Ver logs de nginx:**
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/apache2/domains/s1mple.cloud.error.log
```

3. **Verificar que funciona desde el navegador:**
Visita `http://s1mple.cloud` o `https://s1mple.cloud`

## Notas importantes:

- **HestiaCP reconstruye configuraciones**: Si reconstruyes el dominio desde el panel, se perderán cambios en `nginx.conf`, pero NO se perderán los archivos `_custom` o `_letsencrypt`.

- **Apache sigue corriendo**: HestiaCP usa Apache en el puerto 8080, pero con esta configuración nginx ignorará Apache y enviará todo a Next.js.

- **SSL**: HestiaCP ya tiene SSL configurado. La configuración personalizada funcionará con HTTPS también.

## Si algo sale mal:

```bash
# Restaurar backup (si hiciste uno)
sudo cp /home/bitcanc/conf/web/s1mple.cloud/nginx.conf.backup /home/bitcanc/conf/web/s1mple.cloud/nginx.conf

# O eliminar configuración personalizada
sudo rm /home/bitcanc/conf/web/s1mple.cloud/nginx.conf_custom

# Recargar nginx
sudo systemctl reload nginx
```

