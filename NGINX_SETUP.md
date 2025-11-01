# Configuración de Nginx para s1mple.cloud

## Pasos para configurar Nginx:

### 1. Copiar el archivo de configuración

```bash
# Desde el directorio del proyecto
sudo cp nginx-s1mple-cloud.conf /etc/nginx/sites-available/s1mple-cloud

# O crear el archivo directamente
sudo nano /etc/nginx/sites-available/s1mple-cloud
# Copiar el contenido de nginx-s1mple-cloud.conf
```

### 2. Habilitar el sitio

```bash
# Crear symlink para habilitar el sitio
sudo ln -s /etc/nginx/sites-available/s1mple-cloud /etc/nginx/sites-enabled/

# Verificar que el symlink existe
ls -la /etc/nginx/sites-enabled/ | grep s1mple-cloud
```

### 3. Verificar configuración de Nginx

```bash
# Verificar que no hay errores de sintaxis
sudo nginx -t

# Si hay errores, corrígelos antes de continuar
```

### 4. Recargar Nginx

```bash
# Recargar configuración sin reiniciar
sudo systemctl reload nginx

# O reiniciar completamente
sudo systemctl restart nginx
```

### 5. Verificar estado

```bash
# Verificar que Nginx está corriendo
sudo systemctl status nginx

# Ver logs en tiempo real
sudo tail -f /var/log/nginx/s1mple-cloud-error.log
sudo tail -f /var/log/nginx/s1mple-cloud-access.log
```

## Permisos importantes:

### Permisos de archivos de configuración

```bash
# Nginx necesita leer los archivos de configuración
sudo chmod 644 /etc/nginx/sites-available/s1mple-cloud
sudo chown root:root /etc/nginx/sites-available/s1mple-cloud
```

### Permisos de logs

```bash
# Asegurar que Nginx puede escribir logs
sudo touch /var/log/nginx/s1mple-cloud-access.log
sudo touch /var/log/nginx/s1mple-cloud-error.log
sudo chown www-data:www-data /var/log/nginx/s1mple-cloud-*.log
# o
sudo chown nginx:nginx /var/log/nginx/s1mple-cloud-*.log
```

### Permisos del usuario de PM2

```bash
# Asegurar que el usuario que ejecuta PM2 tiene permisos en el proyecto
# Si PM2 corre como usuario 'tu-usuario':
sudo chown -R tu-usuario:tu-usuario /ruta/a/tu/proyecto

# Verificar que Next.js puede escribir en .next
chmod -R 755 /ruta/a/tu/proyecto/.next
```

## Verificar que todo funciona:

### 1. Verificar que PM2 está corriendo
```bash
pm2 status
pm2 logs s1mple-cloud
```

### 2. Verificar que el puerto 6367 está escuchando
```bash
netstat -tuln | grep 6367
# Debe mostrar: tcp 0 0 0.0.0.0:6367 o 127.0.0.1:6367
```

### 3. Verificar que Nginx puede hacer proxy
```bash
# Desde el servidor, probar la conexión local
curl http://127.0.0.1:6367
# Debe devolver HTML de tu página

# Probar a través de Nginx
curl http://localhost
# Debe devolver lo mismo
```

## Troubleshooting:

### Error 403:
1. Verificar permisos del proyecto
2. Verificar que el usuario de nginx tiene permisos de lectura
3. Verificar logs de nginx: `sudo tail -f /var/log/nginx/error.log`

### Error 502 Bad Gateway:
- Next.js no está corriendo o no escucha en 127.0.0.1:6367
- Verificar: `pm2 logs s1mple-cloud`

### Error 404:
- Verificar que el proxy_pass apunta al puerto correcto (6367)

## SSL/HTTPS (Opcional):

Si quieres usar HTTPS, instala Certbot:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d s1mple.cloud -d www.s1mple.cloud
```

Esto actualizará automáticamente tu configuración de nginx con SSL.

