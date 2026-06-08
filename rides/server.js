import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`[Rides Service] Running on http://localhost:${PORT}`);
});
