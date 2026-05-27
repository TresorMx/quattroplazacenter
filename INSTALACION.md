# Instalación de Quattro Plaza Center — Paso a paso

Esta guía asume **cero conocimiento técnico**. Sigue los pasos en orden, sin saltarte ninguno. Tiempo estimado: **30–45 minutos** la primera vez.

> Cuando veas algo entre `comillas como esta`, es un **comando** que debes pegar en la Terminal.

---

## Parte 1 · Instalar las herramientas (solo se hace 1 vez)

Necesitas 4 cosas instaladas en tu Mac. Si ya las tienes, salta esta parte.

### 1.1 — Homebrew (gestor de paquetes para Mac)

Abre la app **Terminal** (Cmd+Espacio, escribe "Terminal", Enter).

Pega esto y dale Enter:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Te va a pedir tu contraseña de Mac (la que usas para iniciar sesión). Escríbela — no se va a ver nada mientras tecleas, es normal — y dale Enter.

Tarda 5–10 minutos. Cuando termine, **cierra la Terminal y ábrela de nuevo**.

Verifica que se instaló:
```bash
brew --version
```
Debe responder algo tipo `Homebrew 4.x.x`.

### 1.2 — Node.js (motor que corre el sitio)

```bash
brew install node
```

Verifica:
```bash
node --version
```
Debe responder `v22.x.x` o superior.

### 1.3 — pnpm (gestor de librerías, más rápido que npm)

```bash
npm install -g pnpm
```

Verifica:
```bash
pnpm --version
```

### 1.4 — Git + GitHub CLI

```bash
brew install git gh
```

Configura tu identidad (solo la primera vez):
```bash
git config --global user.name "David Baena"
git config --global user.email "david.baena@gmail.com"
```

Conecta GitHub:
```bash
gh auth login
```
- Selecciona: **GitHub.com**
- Selecciona: **HTTPS**
- Te pregunta si quieres autenticarte con browser → **Sí**
- Te abre el navegador, copia el código que te muestra, pégalo en la web. Listo.

### 1.5 — VS Code (editor de código)

Descarga e instala desde: https://code.visualstudio.com

Cuando lo abras la primera vez:
- Cmd+Shift+P → escribe "Shell command" → click en `Install 'code' command in PATH`. Esto te deja abrir VS Code desde Terminal con `code .`

---

## Parte 2 · Abrir el proyecto

### 2.1 — Localizar la carpeta

El proyecto vive en:
```
~/Desktop/quattro-assets/quattroplaza-web
```

### 2.2 — Abrirlo en VS Code

Desde Terminal:
```bash
cd ~/Desktop/quattro-assets/quattroplaza-web
code .
```

(El `cd` cambia la carpeta de trabajo. El `code .` abre VS Code en la carpeta actual.)

### 2.3 — Abrir la Terminal integrada de VS Code

Dentro de VS Code: **Ctrl+`** (la tecla del acento grave, arriba de Tab). Te abre una terminal abajo, ya posicionada en la carpeta del proyecto. **A partir de ahora trabajamos desde ahí.**

---

## Parte 3 · Instalar las librerías del proyecto

En la terminal de VS Code:

```bash
pnpm install
```

Esto descarga unas 400 librerías que el sitio necesita. Tarda 2–4 minutos la primera vez. Al final verás algo como `Done in 2m 14s`.

Si te sale **algún error con "EACCES" o permisos**, prueba:
```bash
sudo chown -R $(whoami) ~/.pnpm
pnpm install
```

---

## Parte 4 · Configurar las llaves (variables de entorno)

El sitio necesita 7 llaves para que todo funcione (Sanity, Stripe, Claude, etc.). Por ahora, para **solo ver el sitio localmente sin que funcione el chatbot/pagos**, podemos arrancarlo con valores vacíos.

### 4.1 — Crear el archivo de llaves

```bash
cp .env.example .env.local
```

(Copia la plantilla a un archivo real que git **no va a subir** porque está en `.gitignore`.)

### 4.2 — Abrirlo en VS Code

Desde el panel izquierdo de VS Code (Explorer), busca `.env.local` y haz click. Lo verás con un montón de líneas vacías.

### 4.3 — Llenar lo mínimo para ver el sitio

Para arrancar sin errores, basta con dejar este valor:

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Los demás los puedes dejar vacíos. **El sitio va a cargar igual**, solo que:
- El chatbot dirá "estoy temporalmente desconectado"
- El cotizador no enviará email pero sí generará el PDF
- El botón Stripe va a estar deshabilitado

**Cuando tengas las llaves reales** (las generas tú en cada plataforma — ver `HANDOVER.md`), las pegas aquí y se activa todo.

> **Importante:** nunca pegues estas llaves en otro archivo ni las compartas. `.env.local` está en `.gitignore` por seguridad — git nunca lo va a subir a GitHub.

---

## Parte 5 · Levantar el sitio localmente

En la terminal de VS Code:

```bash
pnpm dev
```

Espera unos segundos. Verás algo así:

```
▲ Next.js 15.1.7
- Local:        http://localhost:3000
- Network:      http://192.168.1.x:3000

✓ Ready in 2.1s
```

**Abre tu navegador y entra a:** http://localhost:3000

¡Listo! El sitio está corriendo en tu Mac. Cambia entre ES/EN, navega a las plazas, prueba el cotizador, etc.

> Para **detener** el servidor: vuelves a la terminal de VS Code y haces Ctrl+C.

---

## Parte 6 · Hacer cambios y verlos en vivo

Esta es la magia del modo dev: **cambia algo en el código y se actualiza solo en el navegador**.

Prueba:

1. En VS Code, abre `messages/es.json`.
2. Busca `"heroTitle": "..."` y cambia el texto.
3. Guarda (Cmd+S).
4. Mira tu navegador en `localhost:3000` → ya se actualizó solo. ✨

(Esto se llama "hot reload" y aplica a casi todo: textos, estilos, componentes, imágenes.)

---

## Parte 7 · Subir cambios a GitHub (cuando ya tengas el repo creado)

> Esto aplica una vez que hayas corrido el script de deploy inicial (`./scripts/deploy.sh`) o creado el repo a mano. Lee `HANDOVER.md` para el deploy inicial.

### Desde VS Code (la forma fácil)

1. Click en el ícono de **Source Control** en la barra lateral izquierda (parece una "Y" o tres puntos conectados). Atajo: **Ctrl+Shift+G**.
2. Verás la lista de archivos que cambiaste, en amarillo (modificados) o verde (nuevos).
3. Arriba del todo hay un campo de texto. Escribe un mensaje describiendo el cambio. Ejemplo: `actualiza precios gardens` o `agrega plaza tulum`.
4. Click en **✓ Commit** (arriba del campo de mensaje).
5. Te puede preguntar "Stage all changes?" → click en **Yes**.
6. Después del commit, abajo a la izquierda verás un botón **Sync Changes ↻**. Click ahí.
7. **Se sube a GitHub. Vercel detecta el cambio. En ~90 segundos, `quattroplaza.mx` muestra el cambio.** 🎉

### Desde Terminal (alternativa)

```bash
git add .
git commit -m "actualiza precios gardens"
git push
```

---

## Parte 8 · Editar contenido desde Sanity (sin tocar código)

**Para 80% de los cambios** (precios, disponibilidad, agregar plazas nuevas, cambiar fotos, cambiar campos de local, agregar planes de pago) **no necesitas tocar el código.**

Una vez deployado, entra a:
```
https://quattroplaza.mx/studio
```

Inicia sesión con tu email. Ahí editas todo en una UI visual, le das **Publicar**, y los cambios aparecen en el sitio en segundos.

Lo que **sí** requiere tocar código:
- Cambiar el diseño visual (colores, layout)
- Agregar secciones nuevas que no existan
- Cambiar la lógica del cotizador
- Modificar el portal de brokers

Para esos casos: editas en VS Code → Commit → Sync. Listo.

---

## Errores comunes y cómo arreglarlos

### "command not found: pnpm" (o node, gh, brew)
Cierra la Terminal y ábrela de nuevo. Si sigue: vuelve a la Parte 1 y reinstala lo que falte.

### "Port 3000 is already in use"
Ya tienes el servidor corriendo en otra terminal. Ciérrala con Ctrl+C, o arranca en otro puerto:
```bash
pnpm dev -p 3001
```

### El sitio carga pero las imágenes salen rotas
Verifica que la carpeta `public/` existe y tiene contenido:
```bash
ls public/renders
```

### "Module not found" al cargar una página
Falta una librería. Corre:
```bash
pnpm install
```

### Cambié algo y no se actualiza el navegador
- Guarda el archivo (Cmd+S — si no está guardado, no aplica)
- Haz hard refresh en el navegador: Cmd+Shift+R
- Si sigue: detén `pnpm dev` con Ctrl+C y vuelve a correrlo

### "Error: Cannot find module 'next-intl'" o similar
```bash
rm -rf node_modules .next
pnpm install
pnpm dev
```

### El chatbot dice "estoy temporalmente desconectado"
Falta `ANTHROPIC_API_KEY` en `.env.local`. Es normal hasta que la pongas.

---

## Cheatsheet (los 5 comandos que vas a usar siempre)

```bash
# Abrir el proyecto desde Terminal
cd ~/Desktop/quattro-assets/quattroplaza-web && code .

# Arrancar el sitio local (mantener corriendo mientras editas)
pnpm dev

# Detener el sitio
Ctrl+C  # en la terminal donde corre pnpm dev

# Subir cambios a producción (desde VS Code: Ctrl+Shift+G → commit → sync)
git add . && git commit -m "tu mensaje" && git push

# Reinstalar todo si algo está raro
rm -rf node_modules .next && pnpm install
```

---

## Flujo típico de un día normal

1. Abres VS Code en la carpeta del proyecto.
2. Ctrl+` para abrir terminal integrada.
3. `pnpm dev` → ya tienes el sitio en `localhost:3000`.
4. Editas lo que necesites en VS Code.
5. Ves cambios en tiempo real en el navegador.
6. Cuando estés feliz: Ctrl+Shift+G → commit → sync.
7. En ~90 segundos está en producción.

---

¿Algo no funciona? Mándame el error exacto (copia el texto rojo de la terminal) y te lo resuelvo.
