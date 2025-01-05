import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";

interface RoleMember {
  full_name: string;
  member_number: string;
  role: string;
  collector_number?: string;
}

interface MemberCollector {
  number: string;
}

interface MemberData {
  full_name: string;
  member_number: string;
  auth_user_id: string;
  members_collectors: MemberCollector[] | null;
}

const RolesTable = () => {
  const { data: members, isLoading } = useQuery({
    queryKey: ['roles-members'],
    queryFn: async () => {
      // First get all users with admin role
      const { data: adminData, error: adminError } = await supabase
        .from('members')
        .select(`
          full_name,
          member_number,
          auth_user_id,
          members_collectors(number)
        `)
        .filter('auth_user_id', 'in', (
          supabase
            .from('user_roles')
            .select('user_id')
            .eq('role', 'admin')
        ));

      if (adminError) {
        console.error('Error fetching admins:', adminError);
        return [];
      }

      // Then get all collectors
      const { data: collectorData, error: collectorError } = await supabase
        .from('members')
        .select(`
          full_name,
          member_number,
          auth_user_id,
          members_collectors(number)
        `)
        .filter('auth_user_id', 'in', (
          supabase
            .from('user_roles')
            .select('user_id')
            .eq('role', 'collector')
        ));

      if (collectorError) {
        console.error('Error fetching collectors:', collectorError);
        return [];
      }

      // Transform the data
      const admins: RoleMember[] = (adminData || []).map((item: any) => ({
        full_name: item.full_name,
        member_number: item.member_number,
        collector_number: item.members_collectors?.[0]?.number || '',
        role: 'admin'
      }));

      const collectors: RoleMember[] = (collectorData || []).map((item: any) => ({
        full_name: item.full_name,
        member_number: item.member_number,
        collector_number: item.members_collectors?.[0]?.number || '',
        role: 'collector'
      }));

      return [...admins, ...collectors];
    }
  });

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            System Roles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const admins = members?.filter(m => m.role === 'admin') || [];
  const collectors = members?.filter(m => m.role === 'collector') || [];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-dashboard-text">
          <Users className="h-5 w-5" />
          System Roles
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Member Number</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Collector Number</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((member) => (
              <TableRow key={member.member_number}>
                <TableCell className="font-medium">{member.full_name}</TableCell>
                <TableCell>{member.member_number}</TableCell>
                <TableCell className="text-dashboard-accent3">Admin</TableCell>
                <TableCell>{member.collector_number || '-'}</TableCell>
              </TableRow>
            ))}
            {collectors.map((member) => (
              <TableRow key={member.member_number}>
                <TableCell className="font-medium">{member.full_name}</TableCell>
                <TableCell>{member.member_number}</TableCell>
                <TableCell className="text-dashboard-accent2">Collector</TableCell>
                <TableCell>{member.collector_number || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RolesTable;