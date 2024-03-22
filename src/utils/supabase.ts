import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  // process.env.PUBLIC_SUPABASE_URL || "",
  // process.env.SUPABASE_ANON_KEY || ""
  "https://gittjeqpqcmmbterylkd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpdHRqZXFwcWNtbWJ0ZXJ5bGtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDkyMDQzNjQsImV4cCI6MjAyNDc4MDM2NH0.uDpqKiizzzJd8WFrOqPKmwrI9gpCiM08ZHdL2zjE1h8"
);

export const secretSupabase = createClient(
  // process.env.PUBLIC_SUPABASE_URL || "",
  // process.env.SUPABASE_SERVICE_ROLE || ""
  "https://gittjeqpqcmmbterylkd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpdHRqZXFwcWNtbWJ0ZXJ5bGtkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwOTIwNDM2NCwiZXhwIjoyMDI0NzgwMzY0fQ.Y5Zp48dzrtSWzatGtTptbYP-fbvhwqTfQHjmBVNRTSg"
);

export default supabase;
