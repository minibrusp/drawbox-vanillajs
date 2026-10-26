import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
const supabaseProjectId = 'vbcytrbofzkbfnbzerjf'
const supabaseUrl = 'https://vbcytrbofzkbfnbzerjf.supabase.co' // supabase api url
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZiY3l0cmJvZnprYmZuYnplcmpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3NTAxNDQsImV4cCI6MjEwNzMyNjE0NH0.SmJZKymCL_TFI2ky1nY25phz2Wnod34K94MoqeKb0FE' // supabase annon public api
const supabaseTableName = 'canvastest' // supabase db table name
const supabaseStorageUrl = 'https://' + supabaseProjectId + '.supabase.co/storage/v1/object/public/' // storage url. 
const supabaseStorageName = 'CanvasDrawings' // supabase storage name
const supabase = createClient(supabaseUrl, supabaseKey)

export { supabaseTableName, supabaseStorageName, supabaseStorageUrl } 
export default supabase
