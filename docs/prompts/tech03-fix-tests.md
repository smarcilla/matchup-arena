Actúa como un desarrollador que practica user-centric testing.

CONTEXTO: Los integration tests validan flujos de usuario con múltiples
componentes conectados. Deben usar DOM real y buscar elementos como lo
haría un usuario (priorizando getByRole sobre getByTestId).

TAREA: Modifica page Home y crea su integration test.

COMPONENTE REQUIREMENTS:

- UI: muestra "Matchup Arena"

TEST REQUIREMENTS:

- Framework: Vitest + Testing Library
- Imports: render, screen, desde @testing-library/react
- Query prioritaria: getByRole('heading', { name: /matchup arena/i })
- Assertion: expect().toHaveTextContent() para verificar texto
- Estructura: sigue patrón AAA con comentarios

ARCHIVOS:

- app/page.tsx (Home page)
- app/page.test.tsx (test)

VALIDACIÓN: ejecuta pnpm test para verificar
