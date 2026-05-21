import dotenv from "dotenv";
dotenv.config();

import { createApp } from "@/app";
import { ENV } from "@/config/env";

const app = createApp();

app.listen(ENV.PORT, () => {
  console.log(`Urban Detox API running on http://localhost:${ENV.PORT}`);
});
