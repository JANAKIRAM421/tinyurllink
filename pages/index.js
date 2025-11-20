// pages/index.js
import { useEffect, useState } from 'react';

function DateCell({ isoDate }) {
  const [pretty, setPretty] = useState(null);
  useEffect(() => {
    if (!isoDate) return;
    setPretty(new Date(isoDate).toLocaleString());
  }, [isoDate]);
  return <>{pretty ?? (isoDate ? isoDate : 'never')}</>;
}

export default function Home() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [target, setTarget] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/links');
        const data = await res.json();
        setLinks(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const createLink = async (e) => {
    e.preventDefault();
    setError('');
    if (!/^[A-Za-z0-9]{6,8}$/.test(code)) return setError('Code must be 6-8 alphanumeric');
    if (!/^https?:\/\//.test(target)) return setError('Target must be a valid URL starting with http(s)');

    setCreating(true);
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, target }),
      });

      if (res.status === 201) {
        const created = await res.json();
        setLinks(prev => [created, ...prev]);
        setCode(''); setTarget('');
      } else if (res.status === 409) {
        setError('Code already exists');
      } else {
        const txt = await res.text();
        setError('Create failed');
        console.error('create failed', res.status, txt);
      }
    } catch (e) {
      console.error(e);
      setError('Create error');
    } finally {
      setCreating(false);
    }
  };

  const openAndCount = async (code, target) => {
    try {
      await fetch(`/api/links/${code}/click`, { method: 'POST' });
      setLinks(prev => prev.map(l => l.code === code ? { ...l, clicks: (l.clicks || 0) + 1, lastClicked: new Date().toISOString() } : l));
    } catch (e) {
      console.error(e);
    } finally {
      window.open(target, '_blank', 'noopener,noreferrer');
    }
  };

  const deleteLink = async (codeToDelete) => {
    if (!confirm('Delete this link?')) return;
    try {
      await fetch(`/api/links/${codeToDelete}`, { method: 'DELETE' });
      setLinks(prev => prev.filter(l => l.code !== codeToDelete));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-extrabold">TinyLink — Dashboard</h1>
          <div className="text-sm text-slate-500">Create, view and manage short links</div>
        </div>

        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <form className="flex gap-3" onSubmit={createLink}>
            <input value={code} onChange={e => setCode(e.target.value)} placeholder="code (6-8 alnum)" className="border rounded px-3 py-2 w-48" />
            <input value={target} onChange={e => setTarget(e.target.value)} placeholder="target URL" className="border rounded px-3 py-2 flex-1" />
            <button disabled={creating} type="submit" className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-900">
              {creating ? 'Creating...' : 'Create'}
            </button>
          </form>
          {error && <div className="text-red-600 mt-2">{error}</div>}
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-700">Code</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-700">Target</th>
                <th className="text-center px-6 py-3 text-sm font-medium text-slate-700">Clicks</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-700">Last clicked</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-700">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading…</td></tr>
              ) : links.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No links yet</td></tr>
              ) : (
                links.map(l => (
                  <tr key={l.code} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{l.code}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-700 truncate max-w-xl">{l.targetUrl}</div>
                    </td>
                    <td className="px-6 py-4 text-center">{l.clicks ?? 0}</td>
                    <td className="px-6 py-4"><DateCell isoDate={l.lastClicked} /></td>
                    <td className="px-6 py-4">
                      <button onClick={() => openAndCount(l.code, l.targetUrl)} className="text-blue-600 underline mr-3">Open</button>
                      <a className="text-blue-600 underline mr-3" href={`/links/${l.code}/stats`}>Stats</a>
                      <button onClick={() => deleteLink(l.code)} className="px-2 py-1 border rounded">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
