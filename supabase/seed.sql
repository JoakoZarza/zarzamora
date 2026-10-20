-- Apps de ejemplo. Ejecutalo una vez en Supabase > SQL Editor (después de schema.sql).
-- Si una app con el mismo slug ya existe, la saltea.

insert into public.apps (description, features, version, released_on, language, size_label, web_url, apk_url, repo_url, icon_url, is_pwa, works_offline, whats_new, build_tools, build_time, build_quote, privacy, featured, published, slug, name, tagline, category, platform, status, color, position)
values ('Pensada para juntadas con amigos: asados, partidos de fútbol, picadas, truco y salidas. No necesitás crear una cuenta ni descargar nada pesado: la abrís, cargás los gastos y te dice quién le debe a quién.

Cada persona puede aportar plata o cosas, y podés excluir gastos para quienes no participaron (los que no toman alcohol, los vegetarianos). Todo queda guardado en tu teléfono.

Funciona sin internet, así que podés usarla en el medio del campo.', array['Cargar gastos con varios aportantes', 'Calcular quién le debe a quién con la menor cantidad de transferencias', 'Excluir gastos para quien no participó', 'Guardar y restaurar juntadas con un archivo', 'Usarla sin conexión y sin cuenta'], '1.0', '2026-10-12', 'Español', '2 MB', 'https://example.com', '', '', '', true, true, array['Primera versión pública', 'Respaldo y restauración de juntadas en formato JSON'], array['React', 'Vite', 'PWA', 'Claude Code'], '3 semanas', 'La hice porque en el asado siempre era yo el que sacaba las cuentas.', array['No recolecta datos', 'Todo queda guardado en tu teléfono', 'Sin cuentas ni registro'], true, true, 'juntadita', 'Juntadita', 'Dividí los gastos del asado sin pelearte con nadie', 'Finanzas', 'web', 'estable', '#6B2BC2', 0)
on conflict (slug) do nothing;

insert into public.app_media (app_id, kind, url, caption, position)
select id, 'image', '/demo/juntadita-1.svg', 'Resumen de la juntada', 0 from public.apps a
where a.slug = 'juntadita' and not exists (select 1 from public.app_media x where x.app_id = a.id and x.url = '/demo/juntadita-1.svg');

insert into public.app_media (app_id, kind, url, caption, position)
select id, 'image', '/demo/juntadita-2.svg', 'Carga de gastos', 1 from public.apps a
where a.slug = 'juntadita' and not exists (select 1 from public.app_media x where x.app_id = a.id and x.url = '/demo/juntadita-2.svg');

insert into public.app_media (app_id, kind, url, caption, position)
select id, 'image', '/demo/juntadita-3.svg', 'Quién le debe a quién', 2 from public.apps a
where a.slug = 'juntadita' and not exists (select 1 from public.app_media x where x.app_id = a.id and x.url = '/demo/juntadita-3.svg');

insert into public.app_media (app_id, kind, url, caption, position)
select id, 'image', '/demo/juntadita-4.svg', 'Juntadas guardadas', 3 from public.apps a
where a.slug = 'juntadita' and not exists (select 1 from public.app_media x where x.app_id = a.id and x.url = '/demo/juntadita-4.svg');

insert into public.apps (description, features, version, released_on, language, size_label, web_url, apk_url, repo_url, icon_url, is_pwa, works_offline, whats_new, build_tools, build_time, build_quote, privacy, featured, published, slug, name, tagline, category, platform, status, color, position)
values ('Para cuando el desorden te supera y no sabés por dónde arrancar. La app arma un plan con tareas chicas y te muestra una sola por vez.', array['Un plan de limpieza armado a tu medida', 'Una tarea por vez, sin abrumarte', 'Plano de tu casa por ambientes'], '1.0', '2026-09-28', 'Español', '', '', '', 'https://github.com/JoakoZarza/por-donde-empiezo', '', true, true, '{}'::text[], array['React', 'PWA'], '', '', array['No recolecta datos', 'Todo queda guardado en tu teléfono'], false, true, 'por-donde-empiezo', 'Por Dónde Empiezo', 'Ordená tu casa de a un paso por vez', 'Hogar', 'web', 'estable', '#2E8B57', 1)
on conflict (slug) do nothing;

insert into public.apps (description, features, version, released_on, language, size_label, web_url, apk_url, repo_url, icon_url, is_pwa, works_offline, whats_new, build_tools, build_time, build_quote, privacy, featured, published, slug, name, tagline, category, platform, status, color, position)
values ('', '{}'::text[], '0.4', '2026-08-15', 'Español', '', '', '', '', '', true, true, '{}'::text[], array['React', 'Vite', 'Dexie', 'PostgreSQL'], '', '', '{}'::text[], false, true, 'cali-go', 'Cali Go!', 'Escaneá y pagá en el súper sin hacer fila', 'Productividad', 'web', 'beta', '#D4A017', 2)
on conflict (slug) do nothing;

insert into public.apps (description, features, version, released_on, language, size_label, web_url, apk_url, repo_url, icon_url, is_pwa, works_offline, whats_new, build_tools, build_time, build_quote, privacy, featured, published, slug, name, tagline, category, platform, status, color, position)
values ('Registrá tus series y pesos, y seguí una planificación que se adapta a tu progreso.', array['Planificación semanal', 'Registro de pesos y repeticiones', 'Historial de progreso'], '0.9', '2026-09-02', 'Español', '18 MB', '', '', '', '', false, false, '{}'::text[], array['React', 'Capacitor'], '', 'Quería registrar mis pesos sin publicidad entre serie y serie.', '{}'::text[], false, true, 'train', 'Train', 'Entrenamiento de CrossFit con planificación inteligente', 'Fitness', 'android', 'beta', '#E0533D', 3)
on conflict (slug) do nothing;

insert into public.apps (description, features, version, released_on, language, size_label, web_url, apk_url, repo_url, icon_url, is_pwa, works_offline, whats_new, build_tools, build_time, build_quote, privacy, featured, published, slug, name, tagline, category, platform, status, color, position)
values ('', '{}'::text[], '0.2', null, 'Español', '', '', '', '', '', false, false, '{}'::text[], array['Flutter'], '', '', '{}'::text[], false, true, 'escudo-pyme', 'Escudo PyME', 'Inspecciones y checklists para pequeñas empresas', 'Productividad', 'android', 'desarrollo', '#2F5DA8', 4)
on conflict (slug) do nothing;

insert into public.apps (description, features, version, released_on, language, size_label, web_url, apk_url, repo_url, icon_url, is_pwa, works_offline, whats_new, build_tools, build_time, build_quote, privacy, featured, published, slug, name, tagline, category, platform, status, color, position)
values ('', '{}'::text[], '1.0', '2026-07-20', 'Español', '', '', '', '', '', false, false, '{}'::text[], '{}'::text[], '', '', '{}'::text[], false, true, 'presupuest3d', 'Presupuest3D', 'Calculá el costo real de tus impresiones 3D', 'Herramientas 3D', 'web', 'estable', '#0E9AA7', 5)
on conflict (slug) do nothing;

insert into public.apps (description, features, version, released_on, language, size_label, web_url, apk_url, repo_url, icon_url, is_pwa, works_offline, whats_new, build_tools, build_time, build_quote, privacy, featured, published, slug, name, tagline, category, platform, status, color, position)
values ('', '{}'::text[], '1.0', '2026-06-30', 'Español', '', '', '', '', '', false, false, '{}'::text[], '{}'::text[], '', '', '{}'::text[], false, true, 'kawaii-prompt-generator', 'Kawaii Prompt Generator', 'Ideas de figuras kawaii listas para modelar e imprimir', 'Creatividad', 'web', 'estable', '#E86FA5', 6)
on conflict (slug) do nothing;

insert into public.apps (description, features, version, released_on, language, size_label, web_url, apk_url, repo_url, icon_url, is_pwa, works_offline, whats_new, build_tools, build_time, build_quote, privacy, featured, published, slug, name, tagline, category, platform, status, color, position)
values ('', '{}'::text[], '0.7', '2026-08-04', 'Español', '12 MB', '', '', '', '', false, false, '{}'::text[], '{}'::text[], '', '', '{}'::text[], false, true, 'roll-o-meter', 'Roll-O-Meter', 'Medí cuánto filamento te queda en el rollo', 'Herramientas 3D', 'android', 'beta', '#8A6D1F', 7)
on conflict (slug) do nothing;

insert into public.apps (description, features, version, released_on, language, size_label, web_url, apk_url, repo_url, icon_url, is_pwa, works_offline, whats_new, build_tools, build_time, build_quote, privacy, featured, published, slug, name, tagline, category, platform, status, color, position)
values ('', '{}'::text[], '0.1', null, 'Español', '', '', '', '', '', false, false, '{}'::text[], '{}'::text[], '', '', '{}'::text[], false, true, 'orbit', 'Orbit', 'Descripción pendiente', 'Productividad', 'android', 'desarrollo', '#3D2A8C', 8)
on conflict (slug) do nothing;

insert into public.apps (description, features, version, released_on, language, size_label, web_url, apk_url, repo_url, icon_url, is_pwa, works_offline, whats_new, build_tools, build_time, build_quote, privacy, featured, published, slug, name, tagline, category, platform, status, color, position)
values ('', '{}'::text[], '0.5', null, 'Español', '', '', '', '', '', false, false, '{}'::text[], '{}'::text[], '', '', '{}'::text[], false, true, 'trazo-fit', 'Trazo Fit', 'Descripción pendiente', 'Fitness', 'web', 'beta', '#5E8C1F', 9)
on conflict (slug) do nothing;

insert into public.apps (description, features, version, released_on, language, size_label, web_url, apk_url, repo_url, icon_url, is_pwa, works_offline, whats_new, build_tools, build_time, build_quote, privacy, featured, published, slug, name, tagline, category, platform, status, color, position)
values ('', '{}'::text[], '0.1', null, 'Español', '', '', '', '', '', false, false, '{}'::text[], '{}'::text[], '', '', '{}'::text[], false, true, 'tava', 'Tava', 'Descripción pendiente', 'Productividad', 'web', 'desarrollo', '#B5562B', 10)
on conflict (slug) do nothing;

insert into public.apps (description, features, version, released_on, language, size_label, web_url, apk_url, repo_url, icon_url, is_pwa, works_offline, whats_new, build_tools, build_time, build_quote, privacy, featured, published, slug, name, tagline, category, platform, status, color, position)
values ('', '{}'::text[], '0.1', null, 'Español', '', '', '', '', '', false, false, '{}'::text[], '{}'::text[], '', '', '{}'::text[], false, true, 'circufy', 'Circufy', 'Descripción pendiente', 'Productividad', 'android', 'desarrollo', '#7A3E9D', 11)
on conflict (slug) do nothing;

