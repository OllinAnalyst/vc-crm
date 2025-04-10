import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qadpqtzkycavyhmwlpfd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhZHBxdHpreWNhdnlobXdscGZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNDY4NzEsImV4cCI6MjA1OTcyMjg3MX0.R6DbBm9huIpHL-9b4hWqXP8IF4NG_-_IVR6PMe7P_3c'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)