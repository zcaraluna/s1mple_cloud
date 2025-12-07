# Datos de Apuestas - Bastian

Esta carpeta contiene el archivo `bastian_bets.json` donde se almacenan todas las apuestas sobre la fecha de nacimiento de Bastian.

## Estructura del archivo

El archivo `bastian_bets.json` contiene un array de objetos con la siguiente estructura:

```json
[
  {
    "id": "1234567890",
    "name": "Juan Pérez",
    "date": "2024-12-25",
    "timestamp": 1735084800000
  }
]
```

## Ubicación

- **Desarrollo**: Se crea automáticamente en `data/bastian_bets.json`
- **Producción**: Se guarda en el servidor en la misma ubicación

## Notas

- El archivo se crea automáticamente cuando se guarda la primera apuesta
- No es necesario crear el archivo manualmente
- El archivo está ignorado en git (no se sube al repositorio)
- Las apuestas se ordenan automáticamente por fecha



