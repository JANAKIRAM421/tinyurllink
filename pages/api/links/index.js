// pages/api/links/index.js
import prisma from "../../../lib/prisma";




export default async function handler(req, res) {
if (req.method === "GET") {
const links = await prisma.link.findMany({ orderBy: { createdAt: "desc" } });
return res.status(200).json(links);
}


if (req.method === "POST") {
const { code, target } = req.body;


if (!code || !/^[A-Za-z0-9]{6,8}$/.test(code)) {
return res.status(400).json({ error: "invalid code" });
}
if (!target || typeof target !== "string") {
return res.status(400).json({ error: "invalid target" });
}


try {
const exists = await prisma.link.findUnique({ where: { code } });
if (exists) return res.status(409).json({ error: "code exists" });


const created = await prisma.link.create({
data: { code, targetUrl: target, clicks: 0 },
});


return res.status(201).json(created);
} catch (err) {
console.error(err);
return res.status(500).json({ error: "server error" });
}
}


res.setHeader("Allow", "GET, POST");
return res.status(405).end();
}