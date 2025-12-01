# Añadir el hook pre-push con el comando approve-builds

Crea un hook pre-push que ejecute los siguientes comandos

echo "Checking for pnpm build scripts..."
pnpm approve-builds

git add .pnpm-builds.json
