// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { differenceInMinutes, getMonth, getYear } from "date-fns";
import clientPromise from "lib/mongo";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("reporter");

  switch (req.method) {
    case "POST":
      const diff = differenceInMinutes(
        new Date(req.body.to),
        new Date(req.body.from)
      );
      const durationInDecimalHours = diff / 60;
      req.body.hours = Math.round(durationInDecimalHours * 10) / 10;
      const myPost = await db.collection("tasks").insertOne(req.body);
      res.json(myPost);
      break;
    case "GET":
      const month = req.query.month || process.env.CURRENT_MONTH;
      const year = req.query.year || process.env.CURRENT_YEAR;
      const allTasks = await db.collection("tasks").find({}).toArray();

      const filteredData = allTasks.filter((item) => {
        const date = new Date(item.from);
        return (
          getMonth(date).toString() === (month - 1).toString() &&
          getYear(date).toString() === year.toString()
        );
      });
      res.json({ status: 200, data: filteredData });
      break;
  }
}
