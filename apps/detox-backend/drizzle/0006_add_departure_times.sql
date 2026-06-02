ALTER TABLE "departures" ADD COLUMN IF NOT EXISTS "start_time" varchar(10);
ALTER TABLE "departures" ADD COLUMN IF NOT EXISTS "end_time" varchar(10);
