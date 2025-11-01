# Diagnóstico Error 403

## Comandos para verificar en tu VPS:

### 1. Verificar que la aplicación está corriendo
```bash
pm2 status
pm2 logs s1mple-cloud
```

### 2. Verificar que el puerto está escuchando
```bash
netstat -tuln | grep 6367
# o
ss -tuln | grep 6367
```

### 3. Verificar permisos de archivos
```bash
# Asegúrate de que el usuario de PM2 tenga permisos
ls -la
# Los archivos deben pertenecer al usuario que ejecuta PM2
```

### 4. Verificar logs de nginx/apache (si estás usando reverse proxy)
```bash
# Nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Apache
sudo tail -f /var/log/apache2/error.log
```

### 5. Verificar firewall
```bash
# UFW
sudo ufw status
sudo ufw allow 6367

# FirewallD
sudo firewall-cmd --list-all
sudo firewall-cmd --permanent --add-port=6367/tcp
sudo firewall-cmd --reload
```

## Soluciones comunes:

### Si usas Nginx como reverse proxy:

Asegúrate de tener una configuración similar:

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:6367;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Si accedes directamente al puerto:

Verifica que:
1. El puerto 6367 no está bloqueado por el firewall
2. No hay restricciones de IP en el servidor
3. Tu proveedor de VPS permite conexiones al puerto

### Permisos de archivos:

```bash
# Asegurar permisos correctos
chmod -R 755 .
chown -R $USER:$USER .
```

