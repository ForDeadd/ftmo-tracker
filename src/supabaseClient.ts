import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ruwfrinvieqgqildfeyp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1d2ZyaW52aWVxZ3FpbGRmZXlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4ODI2MjIsImV4cCI6MjA2MjQ1ODYyMn0.ybsjewlRhV3iUCayzzX2ZGz3pPOVdMpwW3ingznLLI0'
export const supabase = createClient(supabaseUrl, supabaseKey)
