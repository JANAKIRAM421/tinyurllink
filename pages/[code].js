import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getServerSideProps(context) {
  const { code } = context.params;
  const link = await prisma.link.findUnique({ where: { code } });
  if (!link) {
    return { notFound: true };
  }
  // increment clicks and update lastClicked
  await prisma.link.update({
    where: { code },
    data: { clicks: { increment: 1 }, lastClicked: new Date() }
  });
  return {
    redirect: {
      destination: link.targetUrl,
      permanent: false,
    }
  };
}

export default function RedirectPage() {
  return null;
}
