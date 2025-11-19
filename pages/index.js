import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/links').then(r=>r.json()).then(d=>{ setLinks(d); setLoading(false); });
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError(null);
    const res = await fetch('/api/links', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ code, targetUrl })
    });
    if (res.status === 201) {
      const newLink = await res.json();
      setLinks([newLink, ...links]);
      setCode(''); setTargetUrl('');
      return;
    } else {
      const err = await res.json();
      setError(err.error || 'create failed');
    }
  }

  async function handleDelete(c) {
    await fetch('/api/links/' + c, { method: 'DELETE' });
    setLinks(links.filter(l => l.code !== c));
  }

  return (
    <div style={{padding:20}}>
      <h1>TinyLink — Dashboard</h1>
      <form onSubmit={handleCreate} style={{marginBottom:20}}>
        <input placeholder='code (6-8 alnum)' value={code} onChange={e=>setCode(e.target.value)} />
        <input placeholder='target URL' value={targetUrl} onChange={e=>setTargetUrl(e.target.value)} style={{marginLeft:8}} />
        <button type='submit' style={{marginLeft:8}}>Create</button>
      </form>
      {error && <div style={{color:'red'}}>{error}</div>}
      {loading ? <p>Loading...</p> : (
        <table border='1' cellPadding='8'>
          <thead><tr><th>Code</th><th>Target</th><th>Clicks</th><th>Last clicked</th><th>Actions</th></tr></thead>
          <tbody>
            {links.map(l=> (
              <tr key={l.code}>
                <td>{l.code}</td>
                <td style={{maxWidth:300,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{l.targetUrl}</td>
                <td>{l.clicks}</td>
                <td>{l.lastClicked || 'never'}</td>
                <td>
                  <a href={'/code/' + l.code}>Stats</a> | <button onClick={()=>handleDelete(l.code)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
