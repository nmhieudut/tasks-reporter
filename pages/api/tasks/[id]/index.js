// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { differenceInMinutes } from "date-fns";
import clientPromise from "lib/mongo";
import { ObjectId } from "mongodb";
import numeral from "numeral";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("reporter");
  switch (req.method) {
    case "PUT":
      const diff = differenceInMinutes(
        new Date(req.body.to),
        new Date(req.body.from)
      );
      const durationInDecimalHours = diff / 60;
      req.body.hours = Math.round(durationInDecimalHours * 10) / 10;
      await db.collection("tasks").updateOne(
        { _id: new ObjectId(req.query.id) },
        {
          $set: { ...req.body },
        }
      );
      res.json({ status: 200, message: "OK" });
      break;
    case "DELETE":
      try {
        await db.collection("tasks").deleteOne({
          _id: new ObjectId(req.query.id),
        });
        res.json({ status: 200, message: "OK" });
      } catch (e) {
        console.error({ e });
      }

      break;
  }
}
