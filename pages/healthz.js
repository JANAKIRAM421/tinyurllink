export default function handler(req, res) {
  // For Next.js pages, just render JSON
  return (
    <pre>{JSON.stringify({ok:true, version:'1.0'}, null, 2)}</pre>
  )
}
