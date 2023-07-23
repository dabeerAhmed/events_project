import { connectDatabase, insertDocument } from "../../helper/db-utils";
async function handler(req, res) {
  if (req.method === "POST") {
    const userEmail = req.body.email;

    if (!userEmail || !userEmail.includes("@")) {
      res.status(422).json({ message: "Invalid Email Address" });
      return;
    }

    let client;
    
    try {
      client = await connectDatabase();
    } catch (error) {
      res.status(500).json({message:'Connecting to the database failed!'});
      return;
    }

    try {
      await insertDocument(client, "newsletter", {email:userEmail}); 
      client.close();
    } catch (error) {
      res.status(500).json({message:'Inserting the data failed!'});
      return;
    }
  
    res.status(201).json({ message: "Signed up!" });
  }
}
export default handler;
