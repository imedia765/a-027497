import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type UserRole = 'member' | 'collector' | 'admin' | null;

const ROLE_STALE_TIME = 1000 * 60 * 5; // 5 minutes

export const useRoleAccess = () => {
  const { toast } = useToast();

  const { data: userRole, isLoading: roleLoading, error } = useQuery({
    queryKey: ['userRole'],
    queryFn: async () => {
      console.log('Fetching user role from central hook...');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        console.log('No session found in central role check');
        return null;
      }

      console.log('Session user in central role check:', session.user.id);
      console.log('User metadata:', session.user.user_metadata);

      // First try to get role from user_roles table
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (roleError) {
        console.error('Error fetching role in central hook:', roleError);
        // Don't throw error, try fallback methods
      }

      if (roleData?.role) {
        console.log('Fetched role from central hook:', roleData.role);
        return roleData.role as UserRole;
      }

      // Check JWT token metadata for role
      const metadataRole = session.user.user_metadata?.role;
      if (metadataRole && ['admin', 'collector', 'member'].includes(metadataRole)) {
        console.log('Using role from JWT metadata:', metadataRole);
        return metadataRole as UserRole;
      }

      // If no role found, check if user is a collector
      const { data: memberData, error: memberError } = await supabase
        .from('members')
        .select('collector')
        .eq('auth_user_id', session.user.id)
        .maybeSingle();

      if (memberError) {
        console.error('Error checking collector status:', memberError);
        return 'member' as UserRole;
      }

      if (memberData?.collector) {
        console.log('User is a collector');
        return 'collector' as UserRole;
      }

      console.log('Defaulting to member role');
      return 'member' as UserRole;
    },
    staleTime: ROLE_STALE_TIME,
    retry: 2,
    meta: {
      errorMessage: "Failed to fetch user role"
    }
  });

  const canAccessTab = (tab: string): boolean => {
    console.log('Checking access for tab:', tab, 'User role:', userRole);
    
    if (!userRole) return false;

    switch (userRole) {
      case 'admin':
        return true;
      case 'collector':
        return ['dashboard', 'users'].includes(tab);
      case 'member':
        return tab === 'dashboard';
      default:
        return false;
    }
  };

  return {
    userRole,
    roleLoading,
    error,
    canAccessTab,
  };
};