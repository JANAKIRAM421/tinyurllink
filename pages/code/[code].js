import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function CodeStats() {
  const router = useRouter();
  const { code } = router.query;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code) return;
    fetch('/api/links/' + code)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(()=> setLoading(false));
  }, [code]);

  if (loading) return <p>Loading...</p>;
  if (!data || data.error) return <p>Not found</p>;
  return (
    <div style={{padding:20}}>
      <h1>Stats for {data.code}</h1>
      <p>Target: {data.targetUrl}</p>
      <p>Clicks: {data.clicks}</p>
      <p>Last clicked: {data.lastClicked || 'never'}</p>
    </div>
  );
}
