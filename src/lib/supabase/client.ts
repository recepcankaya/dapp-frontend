import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    "https://gittjeqpqcmmbterylkd.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpdHRqZXFwcWNtbWJ0ZXJ5bGtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDkyMDQzNjQsImV4cCI6MjAyNDc4MDM2NH0.uDpqKiizzzJd8WFrOqPKmwrI9gpCiM08ZHdL2zjE1h8"
  );
}

export function createServiceClient() {
  return createBrowserClient(
    "https://gittjeqpqcmmbterylkd.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpdHRqZXFwcWNtbWJ0ZXJ5bGtkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwOTIwNDM2NCwiZXhwIjoyMDI0NzgwMzY0fQ.Y5Zp48dzrtSWzatGtTptbYP-fbvhwqTfQHjmBVNRTSg"
  );
}
