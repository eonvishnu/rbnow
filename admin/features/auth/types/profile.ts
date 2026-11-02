export interface AdminProfile {
  id: string;
  display_name: string | null;
  phone_number: string | null;
  role: string | null;
  is_verified: boolean | null;
}

export interface AuthContextValue {
  user: import('@supabase/supabase-js').User | null;
  userData: AdminProfile | null;
  loading: boolean;
  isVerified: boolean;
  refreshUserData: (userId: string) => Promise<void>;
  signOut: () => Promise<void>;
}
