#!/bin/bash

# Script para modificar nginx.conf de HestiaCP para apuntar a Next.js
# Hace backup antes de modificar

NGINX_CONF="/home/bitcanc/conf/web/s1mple.cloud/nginx.conf"
BACKUP_FILE="/home/bitcanc/conf/web/s1mple.cloud/nginx.conf.backup.$(date +%Y%m%d_%H%M%S)"

echo "=== Modificando configuración de Nginx para s1mple.cloud ==="
echo ""

# Hacer backup
echo "1. Creando backup..."
sudo cp "$NGINX_CONF" "$BACKUP_FILE"
echo "✓ Backup creado: $BACKUP_FILE"
echo ""

# Modificar proxy_pass
echo "2. Modificando proxy_pass de 8080 a 6367..."
sudo sed -i 's|proxy_pass http://64.176.18.16:8080;|proxy_pass http://127.0.0.1:6367;|g' "$NGINX_CONF"

# Verificar cambios
echo "3. Verificando cambios..."
if grep -q "proxy_pass http://127.0.0.1:6367" "$NGINX_CONF"; then
    echo "✓ proxy_pass actualizado correctamente"
else
    echo "✗ Error: No se pudo actualizar proxy_pass"
    exit 1
fi
echo ""

# Verificar sintaxis de nginx
echo "4. Verificando sintaxis de nginx..."
if sudo nginx -t 2>&1 | grep -q "test is successful"; then
    echo "✓ Configuración válida"
else
    echo "✗ Error en la configuración. Restaurando backup..."
    sudo cp "$BACKUP_FILE" "$NGINX_CONF"
    sudo nginx -t
    exit 1
fi
echo ""

# Recargar nginx
echo "5. Recargando nginx..."
sudo systemctl reload nginx
if [ $? -eq 0 ]; then
    echo "✓ Nginx recargado correctamente"
else
    echo "✗ Error al recargar nginx"
    exit 1
fi
echo ""

echo "=== Configuración completada ==="
echo ""
echo "Prueba acceder a: http://s1mple.cloud"
echo "Para restaurar el backup: sudo cp $BACKUP_FILE $NGINX_CONF && sudo systemctl reload nginx"

