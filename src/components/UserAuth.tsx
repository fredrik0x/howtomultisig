import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useChecklist } from '@/context/ChecklistContext';
import { signInWithOAuth, signOut, OAuthProvider } from '@/lib/supabase';
import { Loader2, LogIn, LogOut, Github, Mail } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

const UserAuth: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  
  // Check if supabase credentials are configured
  const isSupabaseConfigured = useMemo(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    return !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== '' && supabaseAnonKey !== '');
  }, []);

  const handleSignInWithProvider = async (provider: OAuthProvider) => {
    setIsAuthLoading(true);
    try {
      await signInWithOAuth(provider);
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
      toast({
        title: 'Authentication Error',
        description: `Failed to sign in with ${provider}. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Import necessary hooks from ChecklistContext
  const { completedItems, selectedProfile } = useChecklist();

  const handleSignOut = async () => {
    setIsAuthLoading(true);
    try {
      // First, save current progress to the database
      if (user) {
        // Import the saveProgressToDatabase from supabase.ts
        const { saveProgressToDatabase } = await import('@/lib/supabase');
        await saveProgressToDatabase(user.id, completedItems, selectedProfile);
        console.log('Saved progress before logout:', completedItems.length, 'items');
      }

      // Then sign out
      await signOut();
      toast({
        title: 'Signed Out',
        description: 'Your progress has been saved and you have been signed out.',
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Sign Out Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        Loading...
      </Button>
    );
  }

  // User is signed in
  if (isAuthenticated && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="nav" size="sm" className="flex items-center gap-2 text-slate-900 dark:text-white">
            <Avatar className="h-8 w-8">
              {user.avatar_url ? (
                <AvatarImage src={user.avatar_url} alt={user.name || user.email} />
              ) : (
                <AvatarFallback>
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <span className="hidden md:inline text-sm">{user.name || user.email}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span>{user.name}</span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} disabled={isAuthLoading}>
            {isAuthLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Signing out...
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // User is not signed in - only show if supabase is configured
  if (!isSupabaseConfigured) {
    return null;
  }
  
  // Display a dropdown for choosing auth provider
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="nav"
          size="sm"
          disabled={isAuthLoading}
          className="text-slate-900 dark:text-white whitespace-nowrap"
        >
          {isAuthLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Signing in...
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4 mr-2" />
              Sign in
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleSignInWithProvider('google')}>
          <Mail className="mr-2 h-4 w-4" />
          <span>Sign in with Google</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSignInWithProvider('github')}>
          <Github className="mr-2 h-4 w-4" />
          <span>Sign in with GitHub</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAuth;
