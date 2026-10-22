(() => {
  if (window.__woodkindLeadBridgeLoaded) return;
  window.__woodkindLeadBridgeLoaded = true;
  const API = '/api/woodkind';
  const KEY = 'woodkind-admin-integration-token';
  const statuses = ['New','Contacted','Interested','Sample requested','Won','Lost'];
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const css = document.createElement('style');
  css.textContent = '#wkix-fab{position:fixed;right:22px;bottom:22px;z-index:2147483000;background:#244c36;color:#fff;border:0;border-radius:999px;padding:13px 18px;font:600 14px system-ui;box-shadow:0 8px 28px #0002;cursor:pointer}#wkix-panel{position:fixed;right:16px;bottom:78px;z-index:2147483001;width:min(660px,calc(100vw - 24px));height:min(720px,calc(100vh - 100px));display:none;flex-direction:column;background:#f7f8f5;color:#213529;border:1px solid #dce4dc;border-radius:18px;box-shadow:0 20px 65px #12231938;overflow:hidden;font:13px/1.45 system-ui}#wkix-panel *{box-sizing:border-box}#wkix-panel button,#wkix-panel input,#wkix-panel select{font:inherit}#wkix-panel button{border:0;border-radius:8px;background:#315c45;color:white;padding:8px 11px;cursor:pointer;font-weight:650}#wkix-panel button.wkix-light{background:#edf2ec;color:#24372c;border:1px solid #dbe4da}#wkix-panel button:disabled{opacity:.5;cursor:wait}#wkix-panel input,#wkix-panel select{border:1px solid #dbe3d9;background:#fff;border-radius:8px;padding:9px;min-width:0;color:#23372a}#wkix-panel .wkix-head{padding:14px 16px;background:#20392c;color:white;display:flex;align-items:center;justify-content:space-between;gap:12px}#wkix-panel .wkix-head strong{letter-spacing:1.5px}#wkix-panel .wkix-head small{display:block;color:#c8d9cb;margin-top:3px}#wkix-panel .wkix-close{background:transparent;border:1px solid #55705c;font-size:20px;line-height:1}#wkix-panel .wkix-body{padding:14px;overflow:auto;display:grid;gap:12px}#wkix-panel .wkix-card{background:#fff;border:1px solid #e1e8df;border-radius:12px;padding:12px}#wkix-panel .wkix-title{font-weight:750;margin:0 0 9px;font-size:13px}#wkix-panel .wkix-muted{font-size:11px;color:#6e7b70}#wkix-panel .wkix-line{display:flex;gap:8px;flex-wrap:wrap;align-items:center}#wkix-panel .wkix-line input[type=password]{flex:1;min-width:180px}#wkix-panel .wkix-badges{display:flex;flex-wrap:wrap;gap:6px;margin-top:9px}#wkix-panel .wkix-badge{background:#f0f2ed;color:#59685c;border-radius:99px;padding:4px 8px;font-size:11px}#wkix-panel .wkix-badge.ok{background:#e4f3e6;color:#28633a}#wkix-panel .wkix-badge.no{background:#fff0e2;color:#865321}#wkix-panel .wkix-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:9px}#wkix-panel .wkix-tablewrap{overflow:auto;border:1px solid #e0e6de;border-radius:9px;max-height:260px}#wkix-panel table{width:100%;border-collapse:collapse;white-space:nowrap;font-size:11px}#wkix-panel th,#wkix-panel td{text-align:left;padding:8px;border-bottom:1px solid #e9ede7}#wkix-panel th{color:#68766a;background:#f5f7f3;position:sticky;top:0}#wkix-panel td select,#wkix-panel td input{padding:6px;font-size:11px}#wkix-panel .wkix-msg{padding:9px 10px;background:#edf2ec;border-radius:8px;color:#354b39;font-size:12px;overflow-wrap:anywhere}#wkix-panel .wkix-error{background:#fff0ed;color:#8f342c}#wkix-panel code{overflow-wrap:anywhere;word-break:break-word}#wkix-panel .wkix-url{background:#f4f6f2;padding:8px;border-radius:8px;font-size:11px;overflow-wrap:anywhere}@media(max-width:560px){#wkix-fab{right:12px;bottom:12px;padding:11px 14px}#wkix-panel{right:6px;bottom:62px;width:calc(100vw - 12px);height:calc(100vh - 76px);border-radius:14px}#wkix-panel .wkix-body{padding:10px}}';
  document.head.appendChild(css);

  const fab = document.createElement('button');
  fab.id = 'wkix-fab';
  fab.textContent = 'WOODKIND · Clay + Excel';
  fab.setAttribute('aria-label','Open WOODKIND Clay and Excel integration');
  const panel = document.createElement('aside');
  panel.id = 'wkix-panel';
  panel.setAttribute('aria-label','WOODKIND CRM integration panel');
  panel.innerHTML = '<div class="wkix-head"><div><strong>WOODKIND · LEAD BRIDGE</strong><small>Add-on panel — existing admin controls stay in place</small></div><button class="wkix-close" id="wkix-close" aria-label="Close">×</button></div><div class="wkix-body"><div id="wkix-msg" class="wkix-msg">Configure the integration token to load the shared CRM.</div><section class="wkix-card"><h3 class="wkix-title">1 · Connection</h3><div class="wkix-line"><input type="password" id="wkix-token" autocomplete="off" placeholder="Admin integration token"><button id="wkix-save">Use in this tab</button><button class="wkix-light" id="wkix-clear">Clear</button></div><div class="wkix-badges" id="wkix-badges"><span class="wkix-badge">Checking API…</span></div><div class="wkix-actions"><button id="wkix-check">Check connection</button><button class="wkix-light" id="wkix-refresh">Refresh leads</button><button class="wkix-light" id="wkix-export">Export Excel-compatible CSV</button></div><p class="wkix-muted">Token stays in this browser tab only. Do not share it or commit it to GitHub. This is an extra API credential, not a replacement for the website's existing admin login.</p></section><section class="wkix-card"><h3 class="wkix-title">2 · Import Clay / Excel CSV</h3><input type="file" id="wkix-file" accept=".csv,text/csv"><div class="wkix-actions"><button id="wkix-import">Import selected CSV</button></div><p class="wkix-muted">Up to 250 rows per batch. Imported rows are deduplicated before saving; review leads before outreach.</p></section><section class="wkix-card"><h3 class="wkix-title">3 · Live Clay webhook</h3><div class="wkix-muted">Use this URL as a destination for Clay HTTP API POST:</div><div class="wkix-url" id="wkix-webhook-url"></div><div class="wkix-actions"><button class="wkix-light" id="wkix-copy">Copy endpoint</button></div><p class="wkix-muted">Send JSON fields like <code>name</code>, <code>company</code>, <code>work_email</code>, <code>phone</code>, <code>city</code>, <code>domain</code>, <code>linkedin_url</code> and <code>external_id</code>. Set header <code>x-woodkind-webhook-secret</code> to the server's <code>CLAY_WEBHOOK_SECRET</code>. Never put this secret in a URL or table column.</p><p class="wkix-muted">Status changes can send event notifications to a separately configured Clay receiver; this does not directly edit an original source row inside Clay.</p></section><section class="wkix-card"><h3 class="wkix-title">4 · Shared lead pipeline <span class="wkix-muted" id="wkix-count"></span></h3><div class="wkix-tablewrap"><table><thead><tr><th>Company / contact</th><th>City</th><th>Status</th><th>Follow-up</th></tr></thead><tbody id="wkix-rows"><tr><td colspan="4">Connect and refresh to view shared leads.</td></tr></tbody></table></div></section></div>';
  document.body.appendChild(fab);
  document.body.appendChild(panel);
  const $ = id => document.getElementById(id);
  let leads = [];
  fab.addEventListener('click',() => { panel.classList.toggle('wkix-open'); if(panel.classList.contains('wkix-open')) checkHealth(); });
  $('wkix-close').addEventListener('click',() => panel.classList.remove('wkix-open'));
  $('wkix-webhook-url').textContent = window.location.origin + API + '/clay/webhook';
  function token(){ return $('wkix-token').value.trim() || sessionStorage.getItem(KEY) || ''; }
  function setMessage(message, error){ $('wkix-msg').textContent=message; $('wkix-msg').classList.toggle('wkix-error',Boolean(error)); }
  async function request(path, options) {
    const opts = Object.assign({},options || {});
    opts.headers = Object.assign({'Content-Type':'application/json'},opts.headers || {});
    const t = token();
    if(t && !opts.headers.Authorization) opts.headers.Authorization='Bearer '+t;
    const response = await fetch(API+path,opts);
    let body={}; try{body=await response.json();}catch{}
    if(!response.ok) throw new Error(body.error || ('Request failed ('+response.status+')'));
    return body;
  }
  async function checkHealth(){
    try {
      const h=await request('/health'); const c=h.configured || {};
      $('wkix-badges').innerHTML =
        '<span class="wkix-badge '+(c.database?'ok':'no')+'">Database '+(c.database?'configured':'not configured')+'</span>'+
        '<span class="wkix-badge '+(c.adminToken?'ok':'no')+'">Admin token '+(c.adminToken?'configured':'missing')+'</span>'+
        '<span class="wkix-badge '+(c.clayInboundWebhook?'ok':'no')+'">Clay inbound '+(c.clayInboundWebhook?'ready':'needs secret')+'</span>'+
        '<span class="wkix-badge '+(c.clayStatusEventWebhook?'ok':'no')+'">Status events '+(c.clayStatusEventWebhook?'configured':'optional / off')+'</span>';
      if(!c.database || !c.adminToken || !c.clayInboundWebhook) setMessage('API is reachable, but one or more server settings need configuration.',true);
      else setMessage('API is reachable. Enter the integration token to access shared leads.',false);
    } catch(e) {
      $('wkix-badges').innerHTML='<span class="wkix-badge no">API unreachable</span>';
      setMessage('Could not reach '+API+'/health. Deploy the API and HTTPS proxy first. '+e.message,true);
    }
  }
  $('wkix-check').addEventListener('click',checkHealth);
  $('wkix-save').addEventListener('click',() => {
    const t=$('wkix-token').value.trim();
    if(t.length<32) return setMessage('Enter the server integration token (minimum 32 characters).',true);
    sessionStorage.setItem(KEY,t); $('wkix-token').value='';
    setMessage('Token saved for this tab. Loading shared leads…',false); refreshLeads();
  });
  $('wkix-clear').addEventListener('click',() => {sessionStorage.removeItem(KEY);$('wkix-token').value='';setMessage('Integration token cleared from this tab.',false);});
  async function refreshLeads(){
    try { const data=await request('/admin/leads'); leads=Array.isArray(data.leads)?data.leads:[]; renderLeads(); setMessage('Loaded '+leads.length+' shared lead records.',false);}
    catch(e){setMessage(e.message,true);}
  }
  function renderLeads(){
    $('wkix-count').textContent='('+leads.length+')';
    const body=$('wkix-rows');
    if(!leads.length){body.innerHTML='<tr><td colspan="4">No leads yet. Send a row from Clay or import CSV.</td></tr>';return;}
    body.innerHTML=leads.map(l=>'<tr><td><b>'+esc(l.company||l.name||'—')+'</b><br><span class="wkix-muted">'+esc(l.name||'')+(l.email?' · '+esc(l.email):'')+'</span></td><td>'+esc(l.city||'—')+'</td><td><select data-wkix-status="'+esc(l.id)+'">'+statuses.map(s=>'<option '+(s===l.status?'selected':'')+'>'+esc(s)+'</option>').join('')+'</select></td><td><input type="date" data-wkix-follow="'+esc(l.id)+'" value="'+esc(l.nextFollowUp||'')+'"></td></tr>').join('');
    body.querySelectorAll('[data-wkix-status]').forEach(el=>el.addEventListener('change',async ev=>{
      const id=ev.currentTarget.dataset.wkixStatus,status=ev.currentTarget.value;
      try{const out=await request('/admin/leads/'+encodeURIComponent(id),{method:'PATCH',body:JSON.stringify({status})});leads=leads.map(l=>l.id===id?out.lead:l);renderLeads();setMessage('Status saved to shared CRM.'+(out.clayEventSent?' Status-event webhook accepted.':''),false);}
      catch(e){setMessage('Could not save status: '+e.message,true);refreshLeads();}
    }));
    body.querySelectorAll('[data-wkix-follow]').forEach(el=>el.addEventListener('change',async ev=>{
      const id=ev.currentTarget.dataset.wkixFollow,nextFollowUp=ev.currentTarget.value;
      try{const out=await request('/admin/leads/'+encodeURIComponent(id),{method:'PATCH',body:JSON.stringify({nextFollowUp})});leads=leads.map(l=>l.id===id?out.lead:l);renderLeads();setMessage('Follow-up date saved to shared CRM.',false);}
      catch(e){setMessage('Could not save follow-up: '+e.message,true);refreshLeads();}
    }));
  }
  $('wkix-refresh').addEventListener('click',refreshLeads);
  function parseCsv(text){
    const rows=[];let row=[],val='',quoted=false;
    for(let i=0;i<text.length;i++){const ch=text[i];if(ch==='"'&&quoted&&text[i+1]==='"'){val+='"';i++;}else if(ch==='"')quoted=!quoted;else if(ch===','&&!quoted){row.push(val);val='';}else if((ch==='\n'||ch==='\r')&&!quoted){if(ch==='\r'&&text[i+1]==='\n')i++;row.push(val);if(row.some(x=>x.trim()))rows.push(row);row=[];val='';}else val+=ch;}
    row.push(val);if(row.some(x=>x.trim()))rows.push(row);if(!rows.length)return[];
    const headers=rows.shift().map(x=>x.replace(/^\uFEFF/,'').trim().toLowerCase().replace(/[\s-]+/g,'_'));
    return rows.map(r=>Object.fromEntries(headers.map((h,i)=>[h,(r[i]||'').trim()])));
  }
  $('wkix-import').addEventListener('click',async()=>{
    const file=$('wkix-file').files && $('wkix-file').files[0];
    if(!file)return setMessage('Choose a Clay or Excel CSV file first.',true);
    try{const rows=parseCsv(await file.text());const out=await request('/admin/leads/import',{method:'POST',body:JSON.stringify({leads:rows})});leads=Array.isArray(out.leads)?out.leads:leads;renderLeads();setMessage('Import complete. '+out.upserted+' unique records inserted/updated.',false);}
    catch(e){setMessage('CSV import failed: '+e.message,true);}
  });
  $('wkix-export').addEventListener('click',()=>{
    if(!leads.length)return setMessage('Refresh leads before exporting CSV.',true);
    const cols=['name','company','type','city','email','phone','website','linkedin','status','nextFollowUp','notes','source','externalId'];
    const csv=[cols.join(','),...leads.map(l=>cols.map(k=>'"'+String(l[k]==null?'':l[k]).replace(/"/g,'""')+'"').join(','))].join('\r\n');
    const a=document.createElement('a'),url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.href=url;a.download='woodkind-leads-'+new Date().toISOString().slice(0,10)+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  $('wkix-copy').addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText($('wkix-webhook-url').textContent);setMessage('Clay webhook endpoint copied.',false);}
    catch{setMessage('Clipboard blocked. Copy the endpoint text manually.',true);}
  });
  checkHealth();
})();