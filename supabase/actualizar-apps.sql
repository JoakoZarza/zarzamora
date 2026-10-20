-- Carga los links e íconos de las apps publicadas y oculta el resto.
-- Pegalo en Supabase > SQL Editor > New query y tocá Run.
-- Las apps ocultas no se borran: se vuelven a mostrar desde el panel con "Visible en el sitio".

update public.apps set
  web_url = 'https://por-donde-empiezo.vercel.app/',
  icon_url = 'https://por-donde-empiezo.vercel.app/iconos/icono-512.png',
  tagline = 'No tenés que ordenar todo, solo lo siguiente',
  platform = 'web', is_pwa = true, published = true
where slug = 'por-donde-empiezo';

update public.apps set
  web_url = 'https://juntadita-olive.vercel.app/',
  icon_url = 'https://juntadita-olive.vercel.app/icon-512.png',
  platform = 'web', is_pwa = true, published = true
where slug = 'juntadita';

update public.apps set
  web_url = 'https://trazo-fit.vercel.app/',
  icon_url = 'https://trazo-fit.vercel.app/icon-512.svg',
  tagline = 'Seguimiento personal de tu salud',
  category = 'Salud',
  platform = 'web', is_pwa = true, published = true
where slug = 'trazo-fit';

update public.apps set
  web_url = 'https://circufy.vercel.app/',
  tagline = 'Comprá y vendé materiales reciclables en Argentina',
  description = 'La plataforma de economía circular que conecta vendedores y compradores de materiales reciclables en Argentina.',
  category = 'Sustentabilidad',
  color = '#2E7D32',
  platform = 'web', is_pwa = true, status = 'beta', published = true
where slug = 'circufy';

update public.apps set
  web_url = 'https://caligo-demo.vercel.app/',
  icon_url = 'https://caligo-demo.vercel.app/pwa-512x512.png',
  platform = 'web', is_pwa = true, published = true
where slug = 'cali-go';

update public.apps set
  web_url = 'https://joakozarza.github.io/roll-o-meter/index.html',
  icon_url = 'https://joakozarza.github.io/roll-o-meter/icon-512.png',
  tagline = 'Calculá cuánto papel higiénico te queda',
  category = 'Hogar',
  size_label = '',
  platform = 'web', is_pwa = true, published = true
where slug = 'roll-o-meter';

-- Ocultar todas las demás (Train, Escudo PyME, Presupuest3D, Kawaii Prompt Generator, Orbit, Tava)
update public.apps set published = false, featured = false
where slug not in ('por-donde-empiezo', 'juntadita', 'trazo-fit', 'circufy', 'cali-go', 'roll-o-meter');

-- Para comprobar: muestra cómo quedó cada app
select name, published, platform, web_url, icon_url <> '' as tiene_icono from public.apps order by published desc, position;
