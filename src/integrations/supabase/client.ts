// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vhqhgpctklxwemryvdgy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZocWhncGN0a2x4d2Vtcnl2ZGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxODA2NTgsImV4cCI6MjA2NTc1NjY1OH0.UIJ-WraeS9JN2DtOMit_j6_LNfTQaMJYWEWXFiEPm0M";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);