# Poner en marcha Zarzamora

Sin configurar nada, el sitio funciona con las apps de ejemplo. Para usar el panel y cargar tus apps de verdad hacen falta estos pasos (una sola vez, unos 15 minutos).

## 1. Crear la base de datos (Supabase, gratis)

1. Entrá a [supabase.com](https://supabase.com), creá una cuenta y un proyecto nuevo. Región: São Paulo (la más cercana).
2. En el menú de la izquierda, **SQL Editor** → **New query**. Pegá todo el contenido de [`supabase/schema.sql`](../supabase/schema.sql) y tocá **Run**.
3. **Authentication → Sign In / Providers**: dejá activado *Email* y **apagá "Allow new users to sign up"**. Así nadie más puede crearse una cuenta.
4. **Authentication → Users → Add user → Create new user**: poné tu email y una contraseña, y marcá *Auto Confirm User*.
5. Volvé al **SQL Editor** y ejecutá esto (con tu email) para hacerte administrador:

   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'tu-email@ejemplo.com';
   ```

## 2. Conectar el sitio

1. En Supabase: **Project Settings → API Keys**. Copiá la *Project URL* y la *Publishable key*.
2. En la carpeta del proyecto, copiá `.env.example` como `.env.local` y pegá los valores.
3. Reiniciá el servidor (`npm run dev`) y entrá a [localhost:3000/admin](http://localhost:3000/admin).
4. Con la base vacía, el panel te ofrece **Importar apps de ejemplo** para no arrancar de cero. Otra opción es ejecutar [`supabase/seed.sql`](../supabase/seed.sql) en el SQL Editor.

## 3. Publicar en internet (Vercel, gratis)

1. Subí el proyecto a un repositorio de GitHub.
2. En [vercel.com](https://vercel.com), **Add New → Project**, elegí el repositorio.
3. En *Environment Variables* cargá las tres variables de `.env.local`. En `NEXT_PUBLIC_SITE_URL` poné la dirección final (por ejemplo `https://zarzamora.app`).
4. **Deploy**. Cuando compres el dominio, se agrega en *Settings → Domains*.

## Cómo se usa el panel

- **/admin**: planilla con todas las apps. Arrastrá las filas para cambiar el orden; el nombre, la frase, el tipo, el estado, la versión, la visibilidad y la estrella de destacada se editan ahí mismo y se guardan solos.
- **Editar** abre la ficha completa: ícono, enlace o APK, capturas y videos (arrastrar y soltar), descripción, novedades, "Cómo la hice" y privacidad. Se guarda con el botón de abajo o con Ctrl + S.
- **Textos del sitio**: título de portada, "Sobre mí" con tu foto, herramientas, contacto y pie de página.
- Los cambios aparecen en el sitio en segundos, sin volver a publicar.

## Límites del plan gratis de Supabase

- 1 GB de archivos en total y hasta 50 MB por archivo.
- Para APKs grandes o muchos videos, conviene subir el APK a **GitHub Releases** y pegar el enlace, y los videos a **YouTube** (el panel acepta enlaces de los dos).
- Si el proyecto no recibe visitas durante una semana, Supabase lo pausa; se reactiva desde su panel con un clic.
