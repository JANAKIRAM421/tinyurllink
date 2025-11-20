// pages/api/links/[code]/click.js
import prisma from 'lib/prisma';

export default async function handler(req, res) {
  const { code } = req.query;

  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const updated = await prisma.link.update({
      where: { code },
      data: { clicks: { increment: 1 }, lastClicked: new Date() }
    });

    return res.status(200).json({ ok: true, updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "failed to update click" });
  }
}
