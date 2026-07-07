const ADMIN_CSS = `
:root { --moss: #4a5d3a; --bark: #6b4226; --cream: #f7f3e8; --leaf: #7a9b5e; --ink: #2b2b22; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f0ece0; color: var(--ink); line-height: 1.5; }
.top { background: var(--moss); color: #fff; padding: 1rem 1.5rem; display: flex; align-items: center; justify-content: space-between; }
.top h1 { font-size: 1.1rem; }
.top span { font-size: 0.85rem; opacity: 0.8; }
.wrap { max-width: 760px; margin: 0 auto; padding: 2rem 1.5rem; }
h2 { font-size: 1rem; color: var(--moss); margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.05em; }
.chambers { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 2.5rem; }
.chamber-row { background: #fff; border-radius: 8px; padding: 1rem 1.25rem; display: flex; align-items: center; justify-content: space-between; }
.chamber-row strong { font-size: 0.95rem; }
.chamber-row .slug { font-size: 0.8rem; color: var(--bark); font-family: monospace; }
.badge { font-size: 0.75rem; padding: 0.2rem 0.6rem; border-radius: 999px; font-weight: 600; }
.badge.live { background: #d4edda; color: #2d6a4f; }
.badge.draft { background: #fff3cd; color: #856404; }
.badge.archived { background: #e2e3e5; color: #495057; }
.edit-btn { font-size: 0.85rem; padding: 0.4rem 0.9rem; border-radius: 6px; background: var(--leaf); color: #fff; text-decoration: none; border: none; cursor: pointer; }
.form-box { background: #fff; border-radius: 8px; padding: 1.5rem; }
.form-box h2 { margin-bottom: 1.5rem; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.full { grid-column: 1 / -1; }
label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.3rem; color: var(--moss); }
input, textarea, select { width: 100%; padding: 0.6rem 0.75rem; border: 1px solid #ccc; border-radius: 6px; font-size: 0.9rem; font-family: inherit; background: #fafafa; }
textarea { min-height: 90px; resize: vertical; }
.hint { font-size: 0.78rem; color: #888; margin-top: 0.25rem; }
.actions { margin-top: 1.5rem; display: flex; gap: 0.75rem; align-items: center; }
.btn-save { padding: 0.75rem 1.5rem; background: var(--moss); color: #fff; border: none; border-radius: 8px; font-size: 0.95rem; font-weight: 600; cursor: pointer; }
.btn-new { padding: 0.75rem 1.5rem; background: transparent; color: var(--moss); border: 1px solid var(--moss); border-radius: 8px; font-size: 0.95rem; cursor: pointer; text-decoration: none; }
.msg { padding: 0.75rem 1rem; border-radius: 6px; margin-bottom: 1.5rem; font-size: 0.9rem; }
.msg.ok { background: #d4edda; color: #2d6a4f; }
.msg.err { background: #f8d7da; color: #721c24; }
.login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--cream); }
.login-box { background: #fff; border-radius: 12px; padding: 2rem; width: 100%; max-width: 340px; text-align: center; }
.login-box h1 { color: var(--moss); margin-bottom: 0.25rem; }
.login-box p { color: var(--bark); font-size: 0.9rem; margin-bottom: 1.5rem; }
.login-box input { margin-bottom: 1rem; }
.login-box button { width: 100%; padding: 0.75rem; background: var(--moss); color: #fff; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; }
`;

function escape(str = '') {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function loginPage(err = '') {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ECOC Admin</title><style>${ADMIN_CSS}</style></head><body>
<div class="login-wrap"><div class="login-box">
  <h1>ecoc</h1><p>Admin access</p>
  ${err ? `<div class="msg err">${err}</div>` : ''}
  <form method="POST">
    <input type="password" name="password" placeholder="Password" required autofocus>
    <input type="hidden" name="_action" value="login">
    <button type="submit">Enter</button>
  </form>
</div></div></body></html>`;
}

function adminPage(chambers, editRecord, msg, password) {
  const f = editRecord?.fields || {};
  const recId = editRecord?.id || '';
  const isEdit = !!recId;

  const chamberRows = chambers.map(r => {
    const rf = r.fields;
    return `<div class="chamber-row">
      <div>
        <strong>${escape(rf.garden_name || rf.slug)}</strong><br>
        <span class="slug">ecoc.app/${escape(rf.slug)}</span>
      </div>
      <div style="display:flex;gap:0.75rem;align-items:center">
        <span class="badge ${escape(rf.status || 'draft')}">${escape(rf.status || 'draft')}</span>
        <a class="edit-btn" href="?p=${encodeURIComponent(password)}&edit=${r.id}">Edit</a>
      </div>
    </div>`;
  }).join('');

  const statusOptions = ['draft','live','archived'].map(s =>
    `<option value="${s}"${(f.status||'draft')===s?' selected':''}>${s}</option>`
  ).join('');

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ECOC Admin</title><style>${ADMIN_CSS}</style></head><body>
<div class="top"><h1>ecoc admin</h1><span>${chambers.length} chamber${chambers.length!==1?'s':''}</span></div>
<div class="wrap">
  ${msg ? `<div class="msg ${msg.type}">${escape(msg.text)}</div>` : ''}

  <h2>Chambers</h2>
  <div class="chambers">
    ${chamberRows || '<p style="color:#888;font-size:0.9rem">No chambers yet.</p>'}
  </div>

  <div class="form-box">
    <h2>${isEdit ? `Editing: ${escape(f.garden_name || f.slug)}` : 'New chamber'}</h2>
    <form method="POST">
      <input type="hidden" name="password" value="${escape(password)}">
      <input type="hidden" name="_action" value="${isEdit ? 'update' : 'create'}">
      ${isEdit ? `<input type="hidden" name="_recordId" value="${recId}">` : ''}
      <div class="grid">
        <div>
          <label>Slug (URL path)</label>
          <input name="slug" value="${escape(f.slug||'')}" placeholder="BethpageHort" ${isEdit?'readonly':''} required>
          <p class="hint">ecoc.app/<strong>${escape(f.slug||'YourSlug')}</strong></p>
        </div>
        <div>
          <label>Status</label>
          <select name="status">${statusOptions}</select>
        </div>
        <div class="full">
          <label>Garden name</label>
          <input name="garden_name" value="${escape(f.garden_name||'')}" placeholder="Bethpage State Park Greenhouse" required>
        </div>
        <div class="full">
          <label>Tagline</label>
          <input name="tagline" value="${escape(f.tagline||'')}" placeholder="One line — what it is">
        </div>
        <div>
          <label>Chair name</label>
          <input name="chair_name" value="${escape(f.chair_name||'')}" placeholder="Victor Azzaretto">
        </div>
        <div>
          <label>Chair title</label>
          <input name="chair_title" value="${escape(f.chair_title||'')}" placeholder="Horticulture Technician">
        </div>
        <div>
          <label>Chair email</label>
          <input name="chair_email" type="email" value="${escape(f.chair_email||'')}" placeholder="name@parks.ny.gov">
        </div>
        <div>
          <label>Schedule email subject</label>
          <input name="schedule_subject" value="${escape(f.schedule_subject||'')}" placeholder="Schedule a visit - Garden Name">
        </div>
        <div class="full">
          <label>Chair quote</label>
          <textarea name="chair_quote">${escape(f.chair_quote||'')}</textarea>
        </div>
        <div class="full">
          <label>EcoChamber page URL</label>
          <input name="chamber_url" type="url" value="${escape(f.chamber_url||'')}" placeholder="https://ecochamber.xyz/chambers/...">
        </div>
        <div class="full">
          <label>About the garden</label>
          <textarea name="about_body">${escape(f.about_body||'')}</textarea>
        </div>
        <div class="full">
          <label>What a visit looks like</label>
          <textarea name="visit_body">${escape(f.visit_body||'')}</textarea>
        </div>
        <div class="full">
          <label>Why contributing matters</label>
          <textarea name="why_body">${escape(f.why_body||'')}</textarea>
        </div>
        <div>
          <label>Google Maps link</label>
          <input name="map_url" type="url" value="${escape(f.map_url||'')}" placeholder="https://maps.app.goo.gl/...">
        </div>
        <div>
          <label>Instagram handle</label>
          <input name="instagram" value="${escape(f.instagram||'')}" placeholder="bethpagehorticulture">
          <p class="hint">Without the @</p>
        </div>
        <div>
          <label>Photo album URL</label>
          <input name="photo_album_url" type="url" value="${escape(f.photo_album_url||'')}" placeholder="Optional">
        </div>
        <div>
          <label>Hero photo filename</label>
          <input name="hero_photo" value="${escape(f.hero_photo||'hero.jpg')}" placeholder="hero.jpg">
          <p class="hint">Must be uploaded to /${escape(f.slug||'slug')}/assets/</p>
        </div>
        <div>
          <label>Chair photo filename</label>
          <input name="chair_photo" value="${escape(f.chair_photo||'chair.jpg')}" placeholder="chair.jpg">
          <p class="hint">Must be uploaded to /${escape(f.slug||'slug')}/assets/</p>
        </div>
      </div>
      <div class="actions">
        <button class="btn-save" type="submit">${isEdit ? 'Save changes' : 'Create chamber'}</button>
        ${isEdit ? `<a class="btn-new" href="?p=${encodeURIComponent(password)}">+ New chamber</a>` : ''}
      </div>
    </form>
  </div>
</div></body></html>`;
}

async function getAirtable(env, params = '') {
  const res = await fetch(
    `https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}/${env.AIRTABLE_TABLE_ID}?${params}`,
    { headers: { Authorization: `Bearer ${env.AIRTABLE_API_KEY}` } }
  );
  return res.json();
}

async function patchAirtable(env, recordId, fields) {
  const res = await fetch(
    `https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}/${env.AIRTABLE_TABLE_ID}/${recordId}`,
    {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${env.AIRTABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields })
    }
  );
  return res.json();
}

async function postAirtable(env, fields) {
  const res = await fetch(
    `https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}/${env.AIRTABLE_TABLE_ID}`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.AIRTABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ records: [{ fields }] })
    }
  );
  return res.json();
}

function formFields(form) {
  const skip = new Set(['password','_action','_recordId']);
  const fields = {};
  for (const [k, v] of form.entries()) {
    if (!skip.has(k) && v !== '') fields[k] = v;
  }
  return fields;
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const password = url.searchParams.get('p') || '';

  if (!env.ADMIN_PASSWORD || password !== env.ADMIN_PASSWORD) {
    return new Response(loginPage(), { headers: { 'Content-Type': 'text/html' } });
  }

  const editId = url.searchParams.get('edit') || '';
  const saved = url.searchParams.get('saved') || '';

  const [allData, editData] = await Promise.all([
    getAirtable(env, 'sort%5B0%5D%5Bfield%5D=garden_name'),
    editId ? fetch(
      `https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}/${env.AIRTABLE_TABLE_ID}/${editId}`,
      { headers: { Authorization: `Bearer ${env.AIRTABLE_API_KEY}` } }
    ).then(r => r.json()) : null
  ]);

  const msg = saved === '1' ? { type: 'ok', text: 'Saved successfully.' } : null;

  return new Response(
    adminPage(allData.records || [], editData, msg, password),
    { headers: { 'Content-Type': 'text/html' } }
  );
}

export async function onRequestPost({ request, env }) {
  const form = await request.formData();
  const password = form.get('password') || '';
  const action = form.get('_action') || '';

  if (!env.ADMIN_PASSWORD || password !== env.ADMIN_PASSWORD) {
    return new Response(loginPage('Incorrect password.'), { headers: { 'Content-Type': 'text/html' } });
  }

  if (action === 'login') {
    return Response.redirect(new URL(`?p=${encodeURIComponent(password)}`, request.url).href, 303);
  }

  const fields = formFields(form);

  if (action === 'update') {
    const recordId = form.get('_recordId');
    await patchAirtable(env, recordId, fields);
    const slug = fields.slug || '';
    return Response.redirect(
      new URL(`?p=${encodeURIComponent(password)}&edit=${recordId}&saved=1`, request.url).href, 303
    );
  }

  if (action === 'create') {
    const result = await postAirtable(env, fields);
    const newId = result.records?.[0]?.id || '';
    return Response.redirect(
      new URL(`?p=${encodeURIComponent(password)}&edit=${newId}&saved=1`, request.url).href, 303
    );
  }

  return Response.redirect(new URL(`?p=${encodeURIComponent(password)}`, request.url).href, 303);
}
