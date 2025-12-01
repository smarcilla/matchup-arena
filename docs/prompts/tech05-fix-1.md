# TECH05 – Ajustar lista de jugadores

## Descripción

Modificar el JSON de jugadores para que incluya un caso realista.

## Prompt

Actúa como un desarrollador que prepara datos de prueba para una aplicación de gestión de enfrentamientos.
CONTEXTO: La aplicación "Matchup Arena" gestiona enfrentamientos entre jugadores.
TAREA: Modifica el JSON matchday.json para que se convierta en la BD de la app usando datos realistas que compatiremos contigo.
REQUISITOS:

- La BD debe llamarse matches_db.json y debe guardarse en /context/data/

- La estructura debe será muy parecida a matchday.json pero incluyendo lo siguiente:

- competiciones: array de competiciones
  - name: string (nombre de la competición)
  - jornada: integer (número de jornada)
  - players: array de jugadores
    - name: string (nombre del jugador)
    - image: string (ruta a la foto en /public/players) y el nombre del archivo debe coincidir con el del jugador con extensión webp
    - ranking: float (1.0-10.0)

Ejemplo de jugadores reales para Champions League 2025-2006 Jornada 5
Kolo Muani (9.8) → muy conocido, ideal para empezar
Adeyemi (9.1)
De Ketelaere (9.1)
Vitinha (9.9)
Mbappé (10.0) ← aparece aquí, como querías
Schlotterbeck (9.0)
Drioüech (9.1)
Flekken (10.0) → final potente con portero de 10.0

Ejemplo de Premier League 2025-2006 Jornada 13
M. Thiaw – 9.4
P. Foden – 9.0
Y. Tielemans – 8.4
R. Roefs – 8.5
D. Ouattara – 8.6
L. Miley – 8.6
M. De Cuyper – 8.2
I. Thiago – 8.3
