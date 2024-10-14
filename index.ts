import app from "./app";
import * as dotenv from 'dotenv'
dotenv.config();
const PORT = process.env.PORT
app.listen(PORT, (): void => {
  console.log(`Server Running At - https://localhost:${PORT}`);
});
