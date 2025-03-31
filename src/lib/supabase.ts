import { createClient, Session, SupabaseClient } from '@supabase/supabase-js';

// These values should be set in environment variables for production
// For development, you'll need to temporarily add your Supabase URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== '' && supabaseAnonKey !== '');

// Only create client if configured
let supabase: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
  }
} else {
  console.warn('Supabase is not configured. Authentication and sharing features will be disabled.');
}

// Auth-related functions
export type OAuthProvider = 'google' | 'github';

export async function signInWithOAuth(provider: OAuthProvider) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured. Cannot sign in.');
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: window.location.origin,
    }
  });
  
  if (error) {
    console.error(`Error signing in with ${provider}:`, error);
    throw error;
  }
}

// Legacy function for backward compatibility
export async function signInWithGoogle() {
  return signInWithOAuth('google');
}

// Helper function to manually save progress to the database
export async function saveProgressToDatabase(userId: string, completedItems: string[], profile: string) {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('Supabase is not configured. Cannot save progress');
    return null;
  }
  
  try {
    const result = await saveUserChecklist(userId, completedItems, profile);
    return result;
  } catch (error) {
    console.error('Error in saveProgressToDatabase:', error);
    return null;
  }
}

export async function signOut() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured. Cannot sign out.');
  }

  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

export async function getSession() {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  
  return data.session;
}

export function setupAuthListener(callback: (session: Session | null) => void) {
  if (!isSupabaseConfigured || !supabase) {
    // Return a dummy subscription with a no-op unsubscribe
    return { unsubscribe: () => {} };
  }

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  
  return subscription;
}

// Define the report structure that will be stored in Supabase
export interface MultisigReport {
  id: string; // Unique ID for the report
  name: string; // Name of the multisig
  completeditems: string[]; // Array of completed checklist item IDs (database field name)
  completedItems?: string[]; // For TypeScript compatibility with the rest of the app
  profile: string; // Selected threat profile
  created_at?: string; // Timestamp of when the report was created
  reviewer?: string; // Person who reviewed the checklist
  transaction_hash?: string; // Transaction hash for signer profile
}

// Function to create a new report
export async function createReport(data: { 
  name: string; 
  completedItems: string[]; 
  profile: string;
  reviewer?: string;
  transactionHash?: string;
}) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured. Cannot create report.');
  }

  const reportId = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
  
  const { data: report, error } = await supabase
    .from('multisig_reports')
    .insert([
      { 
        id: reportId,
        name: data.name,
        completeditems: data.completedItems,
        profile: data.profile,
        reviewer: data.reviewer,
        transaction_hash: data.transactionHash
      }
    ])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating report:', error);
    throw new Error(`Failed to create report: ${error.message}`);
  }
  
  return reportId;
}

// Function to get a report by ID
export async function getReportById(reportId: string) {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('multisig_reports')
    .select('*')
    .eq('id', reportId)
    .single();
  
  if (error) {
    console.error('Error fetching report:', error);
    return null;
  }
  
  return data as MultisigReport;
}

// Function to save a user's checklist state
export async function saveUserChecklist(userId: string, completedItems: string[], profile: string) {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('Supabase is not configured. Cannot save user checklist.');
    return null;
  }

  const { data, error } = await supabase
    .from('user_checklists')
    .upsert({
      user_id: userId,
      completeditems: completedItems,
      profile: profile,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    })
    .select();
  
  if (error) {
    console.error('Error saving user checklist:', error);
    return null;
  }
  
  return data;
}

// Function to get a user's checklist state
export async function getUserChecklist(userId: string) {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('user_checklists')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // No record found, which is fine for new users
      return null;
    }
    console.error('Error fetching user checklist:', error);
    return null;
  }
  
  return {
    completedItems: data.completeditems || [],
    profile: data.profile || 'large'
  };
}
