// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getMonth, getYear } from "date-fns";
import clientPromise from "lib/mongo";
import * as _ from "lodash";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("reporter");
  switch (req.method) {
    case "GET":
      const allTasks = await db.collection("tasks").find({}).toArray();
      const months = [];

      allTasks
        .forEach((t) => {
          const taskMonth = getMonth(new Date(t.from)) + 1;
          const taskYear = getYear(new Date(t.from));
          const found = months.find(
            (m) => m.month === taskMonth && m.year === taskYear
          );
          if (!found) {
            months.push({
              month: taskMonth,
              year: taskYear,
            });
          }
        })
        ?.sort((a, b) => a.month - b.month);
      res.json({
        status: 200,
        data: months,
      });
      break;
  }
}
