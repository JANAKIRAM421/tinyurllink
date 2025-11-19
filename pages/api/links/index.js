import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { code, targetUrl } = req.body;
    if (!code || !targetUrl) return res.status(400).json({ error: 'code and targetUrl required' });
    if (!/^[A-Za-z0-9]{6,8}$/.test(code)) return res.status(400).json({ error: 'code must match [A-Za-z0-9]{6,8}' });
    try {
      const existing = await prisma.link.findUnique({ where: { code } });
      if (existing) return res.status(409).json({ error: 'code exists' });
      const link = await prisma.link.create({ data: { code, targetUrl } });
      return res.status(201).json(link);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'server error' });
    }
  } else if (req.method === 'GET') {
    const links = await prisma.link.findMany({ orderBy: { createdAt: 'desc' } });
    return res.status(200).json(links);
  } else {
    res.setHeader('Allow', 'GET,POST');
    return res.status(405).end();
  }
}
