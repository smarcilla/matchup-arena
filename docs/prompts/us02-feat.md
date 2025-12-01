# US02 – Ver duelo (Jugador A vs Jugador B)

## Descripción

Como usuario, quiero ver dos jugadores enfrentados y elegir uno tocando su tarjeta, para avanzar hacia determinar mi MVP.

Criterios:

Mostrar dos tarjetas con foto + nombre.

Al pulsar una, se considera ganador.

Debe pasar automáticamente al siguiente duelo.

## Modificación de alcance

Explico todo el proceso. Cuando el usuario hace click en una liga llegamos al duelo que muestra dos jugadores. En desktop, izquierda y derecha, en mobile, uno encima del otro. Al hacer click en uno de los jugadores, se marca como ganador y se avanza al siguiente duelo. Es decir, cuando el usuario selecciona un jugador, esta indicando que ese jugador es mejor que el otro pero aún no sabemos si es el MVP salvo que el resto de juegadores ya estén en la lista de perdedores.

El estado necesario es mayor porque necesitamos una lista de jugadores pendientes de entrar a duelo, ordenados por un criterio aleatorio, y una lista de jugadores que ya han perdido. Cuando el usuario selecciona un jugador, el jugador no seleccionado se añade a la lista de perdedores y se avanza al siguiente duelo. En el siguiente duelo,el ganador sigue y se enfranta al siguiente jugador de la lista de pendientes.

Quiero que haya algun tipo de transición o animación que deje bien claro quien gana y quien pierde en cada duelo. Luego las urls a las imagenes están dentro de la BD de datos (context/data/matches_bd.json).

El tamaño de las imagenes de los juegadores se tiene que ver en grande dentro de la tarjeta, y la tarjeta tiene que tener un borde redondeado y una sombra para que se vea bien.
