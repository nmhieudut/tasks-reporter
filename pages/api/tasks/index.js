// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { format, getMonth, getYear } from "date-fns";
import clientPromise from "lib/mongo";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("reporter");

  switch (req.method) {
    case "POST":
      const myPost = await db.collection("tasks").insertOne(req.body);
      res.json(myPost);
      break;
    case "GET":
      const month = req.query.month || process.env.CURRENT_MONTH;
      const year = req.query.year || process.env.CURRENT_YEAR;
      const allTasks = await db.collection("tasks").find({}).toArray();

      const filteredData = allTasks.filter((item) => {
        const date = new Date(item.date);
        return (
          getMonth(date).toString() === (month - 1).toString() &&
          getYear(date).toString() === year.toString()
        );
      });
      const months = allTasks.map((t) => format(new Date(t.date), "MM/yyyy"));
      res.json({ status: 200, data: filteredData, months });
      break;
  }
}
