import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import LoginForm from '@/components/auth/LoginForm';
import CommitteeUpdate from '@/components/auth/CommitteeUpdate';
import MembershipExpectations from '@/components/auth/MembershipExpectations';
import ImportantInformation from '@/components/auth/ImportantInformation';
import MedicalExaminer from '@/components/auth/MedicalExaminer';
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          return;
        }

        if (session?.user) {
          console.log('Active session found, redirecting to dashboard');
          navigate('/');
        }
      } catch (error) {
        console.error('Session check failed:', error);
        toast({
          title: "Authentication Error",
          description: "Please try logging in again.",
          variant: "destructive",
        });
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session?.user) {
        navigate('/');
      }
    });

    checkSession();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-dashboard-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Pakistan Welfare Association</h1>
            <p className="text-dashboard-text text-lg">Welcome to our community platform. Please login with your member number.</p>
          </div>

          <LoginForm />
          <CommitteeUpdate />
          <MembershipExpectations />
          <ImportantInformation />
          <MedicalExaminer />
        </div>
      </div>
    </div>
  );
};

export default Login;