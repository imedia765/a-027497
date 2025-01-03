import { Shield } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type AppRole = 'admin' | 'collector' | 'member';

interface MemberDetailsSectionProps {
  member: {
    membership_type?: string;
    collector?: string;
    auth_user_id?: string;
  };
  userRole: string | null;
}

const MemberDetailsSection = ({ member, userRole }: MemberDetailsSectionProps) => {
  const { toast } = useToast();

  const handleRoleChange = async (memberId: string, newRole: AppRole) => {
    if (!memberId) {
      toast({
        title: "Error",
        description: "User not found",
        variant: "destructive",
      });
      return;
    }

    try {
      // First, delete existing role
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', memberId);

      if (deleteError) throw deleteError;

      // Then insert new role
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({
          user_id: memberId,
          role: newRole
        });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: `Role updated to ${newRole}`,
      });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-white/10">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-dashboard-muted mb-1">Membership Type</p>
          <p className="text-dashboard-text">{member.membership_type || 'Standard'}</p>
        </div>
        <div>
          <p className="text-dashboard-muted mb-1">Collector</p>
          <p className="text-dashboard-text">{member.collector || 'Not assigned'}</p>
        </div>
        <div>
          <p className="text-dashboard-muted mb-1">Role</p>
          {userRole === 'admin' && member.auth_user_id ? (
            <Select onValueChange={(value) => handleRoleChange(member.auth_user_id!, value as AppRole)}>
              <SelectTrigger className="w-[140px] h-8 bg-dashboard-accent1/10 border-dashboard-accent1/20">
                <SelectValue placeholder="Change Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Admin
                  </div>
                </SelectItem>
                <SelectItem value="collector">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Collector
                  </div>
                </SelectItem>
                <SelectItem value="member">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Member
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <p className="text-dashboard-text">Member</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberDetailsSection;