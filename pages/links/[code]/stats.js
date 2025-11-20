// pages/links/[code]/stats.js
import prisma from "lib/prisma";
export async function getServerSideProps({ params }) {
const { code } = params;
try {
const link = await prisma.link.findUnique({ where: { code } });
if (!link) return { notFound: true };
return { props: { link: JSON.parse(JSON.stringify(link)) } };
} catch (err) {
console.error(err);
return { notFound: true };
}
}


export default function StatsPage({ link }) {
return (
<main style={{ padding: 24, fontFamily: 'system-ui' }}>
<h1>Stats: {link.code}</h1>
<p><strong>Target:</strong> <a href={link.targetUrl} target="_blank" rel="noreferrer">{link.targetUrl}</a></p>
<p><strong>Clicks:</strong> {link.clicks}</p>
<p><strong>Last clicked:</strong> {link.lastClicked ? new Date(link.lastClicked).toLocaleString() : 'never'}</p>
<p><a href="/">Back to dashboard</a></p>
</main>
);
}