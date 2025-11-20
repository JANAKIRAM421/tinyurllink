import prisma from "lib/prisma";
export async function getServerSideProps({ params }) {
const { code } = params;
try {
const link = await prisma.link.findUnique({ where: { code } });
if (!link || !link.targetUrl) return { notFound: true };


await prisma.link.update({
where: { code },
data: { clicks: { increment: 1 }, lastClicked: new Date() },
});


return {
redirect: { permanent: false, destination: link.targetUrl },
};
} catch (err) {
console.error("redirect error", err);
return { notFound: true };
}
}


export default function RedirectPage() {
return null;
}