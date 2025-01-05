import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DashboardView from '@/components/DashboardView';
import MembersList from '@/components/MembersList';
import CollectorsList from '@/components/CollectorsList';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import SidePanel from '@/components/SidePanel';

const UnauthorizedMessage = () => (
  <Alert variant="destructive">
    <ShieldOff className="h-4 w-4" />
    <AlertTitle>Unauthorized Access</AlertTitle>
    <AlertDescription>
      You don't have permission to view this page.
    </AlertDescription>
  </Alert>
);

const LoadingState = () => (
  <div className="space-y-4">
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-32 w-full" />
  </div>
);

const Index = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { canAccessTab, userRole, roleLoading } = useRoleAccess();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (!session) {
          console.log('No session found, redirecting to login');
          navigate('/login');
        } else {
          console.log('Session found:', session.user.id);
          // Check if user has any role
          const { data: userRoles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id);
            
          console.log('User roles from session check:', userRoles);
          
          if (!userRoles || userRoles.length === 0) {
            console.log('No roles found for user, checking member status');
            const { data: memberData } = await supabase
              .from('members')
              .select('id')
              .eq('auth_user_id', session.user.id)
              .maybeSingle();
              
            if (memberData) {
              console.log('User is a member, adding member role');
              await supabase
                .from('user_roles')
                .insert({ user_id: session.user.id, role: 'member' });
            }
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
        if (mounted) {
          navigate('/login');
        }
      } finally {
        if (mounted) {
          setIsAuthChecking(false);
        }
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/login');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    switch (value) {
      case 'dashboard':
        navigate('/');
        break;
      case 'users':
        navigate('/members');
        break;
      case 'collectors':
        navigate('/collectors');
        break;
      default:
        navigate('/');
    }
  };

  // Show loading state while either auth or role is being checked
  if (isAuthChecking || roleLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingState />
      </div>
    );
  }

  // If we're not loading and don't have a role, show unauthorized
  if (!isAuthChecking && !roleLoading && !userRole) {
    console.log('No user role found after loading completed');
    return <UnauthorizedMessage />;
  }

  const renderProtectedRoute = (path: string, Component: React.ComponentType<any>, props: any = {}) => {
    if (!canAccessTab(path)) {
      return <UnauthorizedMessage />;
    }
    return <Component {...props} />;
  };

  return (
    <div className="flex min-h-screen bg-dashboard-dark">
      {userRole && <SidePanel onTabChange={handleTabChange} userRole={userRole} />}
      <div className="flex-1 md:pl-64 w-full">
        <div className="container mx-auto px-4 md:px-8 py-8 pt-20 md:pt-8">
          <Routes>
            <Route 
              path="/" 
              element={renderProtectedRoute('dashboard', DashboardView, { onLogout: () => navigate('/login') })} 
            />
            <Route 
              path="/members" 
              element={renderProtectedRoute('users', MembersList, { searchTerm, userRole })} 
            />
            <Route 
              path="/collectors" 
              element={renderProtectedRoute('collectors', CollectorsList)} 
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Index;