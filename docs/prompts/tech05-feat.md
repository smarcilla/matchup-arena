# TECH05 – Preparar lista de jugadores

## Descripción

Crear JSON con 8 jugadores.
Añadir fotos (pueden estar en /public/players).
Comprobar carga rápida.

## Prompt

Actúa como un desarrollador que prepara datos de prueba para una aplicación de gestión de enfrentamientos.
CONTEXTO: La aplicación "Matchup Arena" gestiona enfrentamientos entre jugadores.
TAREA: Crea una lista de 8 jugadores en formato JSON con nombre, ranking y foto.
REQUISITOS:

- Formato: JSON
- Campos por competición:
  - name: string (nombre de la competición)
  - jornada: integer (número de jornada)
  - players: array de jugadores
- Campos por jugador:
  - name: string (nombre del jugador)
  - ranking: integer (1-100)
  - photo: string (ruta a la foto en /public/players)
- Fotos: usa imágenes genéricas (pueden ser avatares o fotos de stock)
- Validación: asegúrate de que el JSON es válido y bien estructurado
  ENTREGA: devuelve solo el JSON sin explicaciones adicionales.
