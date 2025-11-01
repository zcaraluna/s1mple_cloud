#!/bin/bash

echo "=== Verificación del Servidor s1mple.cloud ==="
echo ""

# 1. Verificar PM2
echo "1. Verificando PM2..."
pm2 status
echo ""

# 2. Verificar logs de PM2
echo "2. Últimas líneas de logs de PM2 (últimas 20 líneas):"
pm2 logs s1mple-cloud --lines 20 --nostream
echo ""

# 3. Verificar puerto 6367
echo "3. Verificando si el puerto 6367 está escuchando..."
if netstat -tuln 2>/dev/null | grep -q ":6367"; then
    echo "✓ Puerto 6367 está activo:"
    netstat -tuln | grep 6367
else
    echo "✗ Puerto 6367 NO está escuchando"
fi
echo ""

# 4. Verificar conexión local
echo "4. Probando conexión local al puerto 6367..."
if curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:6367 | grep -q "200"; then
    echo "✓ La aplicación responde correctamente en localhost:6367"
    curl -s http://127.0.0.1:6367 | head -n 5
else
    echo "✗ La aplicación NO responde en localhost:6367"
    echo "Código HTTP: $(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:6367)"
fi
echo ""

# 5. Verificar Nginx (si está instalado)
echo "5. Verificando Nginx..."
if command -v nginx &> /dev/null; then
    echo "Nginx está instalado"
    echo "Estado:"
    systemctl status nginx --no-pager -l | head -n 5
    echo ""
    echo "Configuraciones activas:"
    ls -la /etc/nginx/sites-enabled/ 2>/dev/null || echo "No hay sitios habilitados"
    echo ""
    echo "Últimos errores de Nginx:"
    tail -n 10 /var/log/nginx/error.log 2>/dev/null || echo "No se puede acceder a los logs"
else
    echo "Nginx no está instalado"
fi
echo ""

# 6. Verificar firewall
echo "6. Verificando firewall..."
if command -v ufw &> /dev/null; then
    echo "Estado UFW:"
    sudo ufw status | head -n 10
elif command -v firewall-cmd &> /dev/null; then
    echo "Estado firewalld:"
    sudo firewall-cmd --list-all 2>/dev/null || echo "No se puede verificar firewall"
else
    echo "No se detectó firewall configurado"
fi
echo ""

# 7. Verificar permisos del proyecto
echo "7. Verificando permisos del directorio actual..."
pwd
ls -la . | head -n 10
echo ""

echo "=== Verificación completada ==="

