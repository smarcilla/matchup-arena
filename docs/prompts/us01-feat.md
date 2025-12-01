# US01 – Pantalla inicial

## Descripción

Como usuario, quiero ver una pantalla inicial con un mensaje con el título o nombre de la app "Matchup Arena", una breve sobre el objetivo de la app ("es una app para que el usuario pueda decidir quien fue el MVP de una competición en una jornada concreta") y debajo un listado de competiciones disponibles. Si el usario hace click sobre una competición, entonces lo llevará a la pantalla de duelos o ejecución de la competición.

De momento esa segunda pantalla no se tiene que implementar aún pero si podría tener un contenido muy básico que refleje la competición seleccionada.

La BD de competiciones está dentro de context/data/matches_db.json

Criterios de aceptación:

Debe mostrar un título.

Debe mostrar una frase muy breve explicando la mecánica.

Debe hacer un listado con las 2 competiciones disponibles en la BD.

Al hacer click en una competición, debe llevar a una pantalla nueva (puede ser muy básica) que muestre el nombre de la competición seleccionada.

A nivel de diseño he pensado en que la página page.tsx podría ser esta primera pantalla, pero parece que como mínimo competetición debería ser un componente aparte.

Sobre la segunda pantalla, duelos de momento puede ser una page sencilla.

El estado lo vamos a manejar con zustand. Ya tenemos una carpeta store en un archivo llamado gameStore.ts pero si hay una mejor forma de organizarlo, adelante.
