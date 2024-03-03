// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import clientPromise from "lib/mongo";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("reporter");
  switch (req.method) {
    case "PUT":
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
