import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

export type UserRole = 'admin' | 'collector' | 'member' | null;

const ROLE_STALE_TIME = 1000 * 60 * 5; // 5 minutes

export const useRoleAccess = () => {
  const { data: userRole = null, isLoading: roleLoading, error } = useQuery({
    queryKey: ['userRole'],
    queryFn: async () => {
      console.log('Fetching user role from central hook...');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        console.log('No session found in central role check');
        return null;
      }

      console.log('Session user in central role check:', session.user.id);

      try {
        // First check user_roles table
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id);

        if (rolesError) {
          console.error('Error fetching user roles:', rolesError);
          throw rolesError;
        }

        // If no roles found, check if user is a member and assign role
        if (!userRoles || userRoles.length === 0) {
          console.log('No roles found, checking member status');
          const { data: memberData } = await supabase
            .from('members')
            .select('id')
            .eq('auth_user_id', session.user.id)
            .maybeSingle();

          if (memberData) {
            console.log('User is a member, adding member role');
            const { error: insertError } = await supabase
              .from('user_roles')
              .insert({ user_id: session.user.id, role: 'member' });

            if (insertError) {
              console.error('Error adding member role:', insertError);
              throw insertError;
            }

            return 'member' as UserRole;
          }
        } else {
          // Return the highest priority role if multiple exist
          if (userRoles.some(r => r.role === 'admin')) return 'admin' as UserRole;
          if (userRoles.some(r => r.role === 'collector')) return 'collector' as UserRole;
          if (userRoles.some(r => r.role === 'member')) return 'member' as UserRole;
        }

        console.log('No valid role found for user');
        return null;

      } catch (error) {
        console.error('Error determining user role:', error);
        throw error;
      }
    },
    staleTime: ROLE_STALE_TIME,
    retry: 1,
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