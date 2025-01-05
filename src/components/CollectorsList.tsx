import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CollectorMembers from './CollectorMembers';
import TotalCount from './TotalCount';

interface Collector {
  id: string;
  name: string | null;
  prefix: string | null;
  number: string | null;
  email: string | null;
  phone: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
  member_number: string | null;
  memberCount?: number;
}

const CollectorsList = () => {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [expandedCollector, setExpandedCollector] = useState<string | null>(null);

  const { data: collectors, isLoading } = useQuery({
    queryKey: ['collectors'],
    queryFn: async () => {
      console.log('Fetching collectors...');
      
      const { data: collectorsData, error: collectorsError } = await supabase
        .from('members_collectors')
        .select(`
          id,
          name,
          prefix,
          number,
          email,
          phone,
          active,
          created_at,
          updated_at,
          member_number
        `)
        .order('number', { ascending: true });
      
      if (collectorsError) {
        console.error('Error fetching collectors:', collectorsError);
        setError(collectorsError.message);
        return [];
      }

      return await Promise.all(collectorsData.map(async (collector) => {
        const { count, error: countError } = await supabase
          .from('members')
          .select('*', { count: 'exact', head: true })
          .eq('collector', collector.name);
        
        if (countError) {
          console.error('Error fetching member count:', countError);
          toast({
            title: "Error",
            description: "Failed to fetch member count",
            variant: "destructive",
          });
        }
        
        return {
          ...collector,
          memberCount: count || 0,
          memberNumber: collector.member_number
        };
      }) || []);
    }
  });

  // Add a new query for total members count
  const { data: totalMembers } = useQuery({
    queryKey: ['total-members'],
    queryFn: async () => {
      const { count } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const toggleCollector = (collectorId: string) => {
    setExpandedCollector(expandedCollector === collectorId ? null : collectorId);
  };

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading collectors: {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TotalCount 
        items={[
          {
            count: collectors?.length || 0,
            label: "Total Collectors",
            icon: <Users className="h-5 w-5 text-dashboard-accent1" />
          },
          {
            count: totalMembers || 0,
            label: "Total Members",
            icon: <UserCheck className="h-5 w-5 text-dashboard-accent2" />
          }
        ]}
      />

      <div className="space-y-4">
        {collectors?.map((collector) => (
          <div key={collector.id} className="space-y-2">
            <Card 
              className="p-6 bg-dashboard-card hover:bg-dashboard-card/90 transition-all duration-300 border-dashboard-accent1/10 hover:border-dashboard-accent1/20 cursor-pointer"
              onClick={() => toggleCollector(collector.id)}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl font-semibold text-dashboard-accent1">
                      {collector.name}
                    </h3>
                    <p className="text-sm text-dashboard-muted mt-1">
                      Member Number: {collector.memberNumber || 'Not assigned'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className="bg-dashboard-accent2/10 text-dashboard-accent2 border-dashboard-accent2/20 hover:bg-dashboard-accent2/15"
                    >
                      <UserCheck className="w-3 h-3 mr-1" />
                      {collector.memberCount} Members
                    </Badge>
                    {collector.active ? (
                      <Badge 
                        variant="outline" 
                        className="bg-dashboard-accent3/10 text-dashboard-accent3 border-dashboard-accent3/20 hover:bg-dashboard-accent3/15"
                      >
                        Active
                      </Badge>
                    ) : (
                      <Badge 
                        variant="outline" 
                        className="bg-dashboard-muted/10 text-dashboard-muted border-dashboard-muted/20"
                      >
                        Inactive
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-10 h-10 text-dashboard-accent1/20" />
                  {expandedCollector === collector.id ? (
                    <ChevronUp className="w-6 h-6 text-dashboard-accent1" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-dashboard-accent1" />
                  )}
                </div>
              </div>
            </Card>
            {expandedCollector === collector.id && collector.name && (
              <div className="pl-4 border-l-2 border-dashboard-accent1/20">
                <CollectorMembers collectorName={collector.name} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectorsList;