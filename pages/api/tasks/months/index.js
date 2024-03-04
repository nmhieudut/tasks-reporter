// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getMonth, getYear } from "date-fns";
import clientPromise from "lib/mongo";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("reporter");
  switch (req.method) {
    case "GET":
      const allTasks = await db.collection("tasks").find({}).toArray();
      const months = allTasks
        .map((t) => ({
          month: getMonth(new Date(t.date)) + 1,
          year: getYear(new Date(t.date)),
        }))
        .sort((a, b) => a.month - b.month);
      res.json({ status: 200, data: months });
      break;
  }
}
