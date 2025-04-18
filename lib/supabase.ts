import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://errsgppniauyaivhyltv.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVycnNncHBuaWF1eWFpdmh5bHR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2OTY4ODYsImV4cCI6MjA2MDI3Mjg4Nn0.FlIGAV-9j5C-j9hBRfQStsGJTtYqp_WMhVQFy4n_nJY"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
