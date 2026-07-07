const CSS = `
:root {
  --moss: #4a5d3a; --bark: #6b4226; --cream: #f7f3e8; --leaf: #7a9b5e; --ink: #2b2b22;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: var(--cream); color: var(--ink); line-height: 1.5; }
a { color: var(--moss); }
.hero { position: relative; min-height: 92vh; display: flex; align-items: flex-end; }
.hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; }
.hero::after { content: ""; position: absolute; inset: 0; background: linear-gradient(to top, rgba(20,20,10,0.85), rgba(20,20,10,0.1)); z-index: 1; }
.hero-overlay { position: relative; z-index: 2; color: #fff; padding: 2rem 1.5rem 3rem; width: 100%; max-width: 640px; margin: 0 auto; text-align: center; }
.hero-overlay h1 { font-size: 1.9rem; margin-bottom: 0.5rem; }
.tagline { font-size: 1.05rem; opacity: 0.95; margin-bottom: 1.5rem; }
.cta-group { display: flex; flex-direction: column; gap: 0.75rem; align-items: center; }
.cta-primary, .cta-secondary { display: inline-block; padding: 0.9rem 1.75rem; border-radius: 999px; text-decoration: none; font-weight: 600; width: 100%; max-width: 320px; text-align: center; }
.cta-primary { background: var(--leaf); color: #fff; }
.cta-secondary { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.6); }
.trust { max-width: 640px; margin: 0 auto; padding: 2rem 1.5rem; display: flex; align-items: center; gap: 1.25rem; }
.chair-photo { width: 76px; height: 76px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.trust blockquote p { font-style: italic; margin-bottom: 0.35rem; }
.trust blockquote footer { font-size: 0.9rem; color: var(--bark); }
.details { max-width: 640px; margin: 0 auto; padding: 0 1.5rem 2rem; }
.details section { padding: 1.5rem 0; border-top: 1px solid rgba(0,0,0,0.08); }
.details h2 { font-size: 1.1rem; color: var(--moss); margin-bottom: 0.5rem; }
.channels ul { list-style: none; }
.channels li { padding: 0.4rem 0; }
.channels a { text-decoration: none; font-weight: 500; }
.site-footer { text-align: center; padding: 1.5rem; font-size: 0.85rem; color: var(--bark); }
`;

function escape(str = '') {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function renderChamber(f, slug) {
  const heroSrc = `/${slug}/assets/${f.hero_photo || 'hero.jpg'}`;
  const chairSrc = `/${slug}/assets/${f.chair_photo || 'chair.jpg'}`;
  const scheduleHref = `mailto:${f.chair_email}?subject=${encodeURIComponent(f.schedule_subject || 'Schedule a visit')}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escape(f.garden_name)} · EcoChamber</title>
<meta name="description" content="${escape(f.tagline)}">
<style>${CSS}</style>
</head>
<body>
<header class="hero">
  <img src="${heroSrc}" alt="${escape(f.garden_name)}" class="hero-img">
  <div class="hero-overlay">
    <h1>${escape(f.garden_name)}</h1>
    <p class="tagline">${escape(f.tagline)}</p>
    <div class="cta-group">
      <a class="cta-primary" href="${scheduleHref}">Schedule a visit / tour</a>
      <a class="cta-secondary" href="${escape(f.chamber_url)}" target="_blank" rel="noopener">Log a visit →</a>
    </div>
  </div>
</header>

<section class="trust">
  <img src="${chairSrc}" alt="${escape(f.chair_name)}" class="chair-photo">
  <blockquote>
    <p>"${escape(f.chair_quote)}"</p>
    <footer>— ${escape(f.chair_name)}, ${escape(f.chair_title)}</footer>
  </blockquote>
</section>

<main class="details">
  <section>
    <h2>What we grow</h2>
    <p>${escape(f.about_body)}</p>
  </section>
  <section>
    <h2>What a visit looks like</h2>
    <p>${escape(f.visit_body)}</p>
  </section>
  <section>
    <h2>Why contributing matters</h2>
    <p>${escape(f.why_body)}</p>
  </section>
  <section class="channels">
    <h2>Find us</h2>
    <ul>
      ${f.map_url ? `<li><a href="${escape(f.map_url)}" target="_blank" rel="noopener">📍 Directions</a></li>` : ''}
      ${f.instagram ? `<li><a href="https://www.instagram.com/${escape(f.instagram)}" target="_blank" rel="noopener">📷 @${escape(f.instagram)}</a></li>` : ''}
      ${f.photo_album_url ? `<li><a href="${escape(f.photo_album_url)}" target="_blank" rel="noopener">🖼️ Photo album</a></li>` : ''}
    </ul>
  </section>
</main>

<footer class="site-footer">
  <p>Powered by <a href="https://ecochamber.xyz" target="_blank" rel="noopener">EcoChamber</a></p>
</footer>
</body>
</html>`;
}

export async function onRequest({ params, env }) {
  const slug = params.slug;

  const apiKey = env.AIRTABLE_API_KEY;
  const baseId = env.AIRTABLE_BASE_ID;
  const tableId = env.AIRTABLE_TABLE_ID;

  const filter = encodeURIComponent(`{slug}="${slug}"`);
  const res = await fetch(
    `https://api.airtable.com/v0/${baseId}/${tableId}?filterByFormula=${filter}&maxRecords=1`,
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );

  const data = await res.json();

  if (!data.records?.length) {
    return new Response('Chamber not found', { status: 404 });
  }

  const f = data.records[0].fields;

  if (f.status !== 'live') {
    return new Response('Chamber not found', { status: 404 });
  }

  return new Response(renderChamber(f, slug), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
