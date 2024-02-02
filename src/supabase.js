import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://mwolxfybpfzycsfhsjzx.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13b2x4ZnlicGZ6eWNzZmhzanp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY3OTU0MjMsImV4cCI6MjAyMjM3MTQyM30.o2Io1l9xWRTQeoI-iS89y2nquVmeEEj_lsyswYGw-5c"
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;