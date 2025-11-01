#!/bin/bash

echo "=== Verificando configuración de Nginx para s1mple.cloud ==="
echo ""

# Verificar si existe configuración en el directorio de bitcanc
echo "1. Buscando configuración existente..."
if [ -d "/home/bitcanc/conf/web/s1mple.cloud" ]; then
    echo "✓ Directorio de configuración existe:"
    ls -la /home/bitcanc/conf/web/s1mple.cloud/
    echo ""
    
    if [ -f "/home/bitcanc/conf/web/s1mple.cloud/nginx.conf" ]; then
        echo "✓ Archivo nginx.conf encontrado:"
        cat /home/bitcanc/conf/web/s1mple.cloud/nginx.conf
    else
        echo "✗ No se encontró nginx.conf"
    fi
else
    echo "✗ No existe /home/bitcanc/conf/web/s1mple.cloud"
fi

echo ""
echo "2. Verificando includes de nginx..."
if [ -f "/etc/nginx/nginx.conf" ]; then
    echo "Configuración principal de nginx incluye:"
    grep -r "include" /etc/nginx/nginx.conf | head -10
fi

echo ""
echo "3. Buscando archivos de configuración que mencionen s1mple.cloud..."
find /etc/nginx -name "*.conf" -type f -exec grep -l "s1mple.cloud" {} \; 2>/dev/null

echo ""
echo "=== Verificación completada ==="

