import { Card } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import CollectorInfo from "./analyzer/CollectorInfo";
import DatabaseConfig from "./analyzer/DatabaseConfig";
import MemberDetails from "./analyzer/MemberDetails";
import SecurityAnalysis from "./analyzer/SecurityAnalysis";
import UserRoles from "./analyzer/UserRoles";
import RolesTable from "./RolesTable";

const MemberAnalyzer = () => {
  const { data: analyzerData } = useQuery({
    queryKey: ['analyzer-data'],
    queryFn: async () => {
      const { data: tables } = await supabase.rpc('get_tables_info');
      const { data: policies } = await supabase.rpc('get_rls_policies');
      const { data: roles } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: collectorData } = await supabase
        .from('members_collectors')
        .select('*')
        .maybeSingle();

      const { data: memberData } = await supabase
        .from('members')
        .select('*')
        .maybeSingle();

      return {
        tables,
        policies,
        roles,
        collectorData,
        memberData
      };
    }
  });

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-dashboard-text mb-4">System Analysis</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-4 bg-dashboard-card border-dashboard-border">
          <CollectorInfo collectorStatus={analyzerData?.collectorData} />
        </Card>
        <Card className="p-4 bg-dashboard-card border-dashboard-border">
          <DatabaseConfig 
            tables={analyzerData?.tables || []} 
            policies={analyzerData?.policies || []} 
          />
        </Card>
        <Card className="p-4 bg-dashboard-card border-dashboard-border">
          <MemberDetails memberDetails={analyzerData?.memberData} />
        </Card>
        <Card className="p-4 bg-dashboard-card border-dashboard-border">
          <SecurityAnalysis dbConfig={{
            tables: analyzerData?.tables || [],
            policies: analyzerData?.policies || []
          }} />
        </Card>
        <Card className="p-4 bg-dashboard-card border-dashboard-border">
          <UserRoles roles={analyzerData?.roles || []} />
        </Card>
      </div>

      <RolesTable />
    </div>
  );
};

export default MemberAnalyzer;