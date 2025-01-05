import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Database } from '@/integrations/supabase/types';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Member = Database['public']['Tables']['members']['Row'];

interface MembersListProps {
  searchTerm: string;
  userRole: string | null;
}

const ITEMS_PER_PAGE = 4;

const MembersList = ({ searchTerm, userRole }: MembersListProps) => {
  const [currentPage, setCurrentPage] = useState(0);

  const { data: members, isLoading, error } = useQuery({
    queryKey: ['members', searchTerm, userRole],
    queryFn: async () => {
      console.log('Fetching members with role:', userRole);
      let query = supabase
        .from('members')
        .select('*');
      
      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,member_number.ilike.%${searchTerm}%,collector.ilike.%${searchTerm}%`);
      }

      if (userRole === 'collector') {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          console.log('Filtering members for collector:', user.id);
          const { data: collectorData } = await supabase
            .from('members_collectors')
            .select('name')
            .single();
          
          if (collectorData?.name) {
            console.log('Filtering by collector name:', collectorData.name);
            query = query.eq('collector', collectorData.name);
          }
        }
      }
      
      const { data, error } = await query
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching members:', error);
        throw error;
      }
      
      console.log('Fetched members:', data?.length || 0);
      return data as Member[];
    },
  });

  if (isLoading) return <div className="text-center py-4">Loading members...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error loading members: {error.message}</div>;
  if (!members?.length) return <div className="text-center py-4">No members found</div>;

  const totalPages = Math.ceil(members.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const displayedMembers = members.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[600px] w-full rounded-md">
        <Accordion type="single" collapsible className="space-y-4">
          {displayedMembers.map((member) => (
            <AccordionItem 
              key={member.id} 
              value={member.id}
              className="bg-dashboard-card border-white/10 shadow-lg hover:border-dashboard-accent1/50 transition-all duration-300 p-6 rounded-lg border"
            >
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-6 w-full">
                  <Avatar className="h-16 w-16 border-2 border-dashboard-accent1/20">
                    <AvatarFallback className="bg-dashboard-accent1/20 text-lg text-dashboard-accent1">
                      {member.full_name?.charAt(0) || 'M'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <h3 className="text-xl font-medium text-dashboard-accent2 mb-1">{member.full_name}</h3>
                      <p className="bg-dashboard-accent1/10 px-3 py-1 rounded-full inline-flex items-center">
                        <span className="text-dashboard-accent1">Member #</span>
                        <span className="text-dashboard-accent2 font-medium ml-1">{member.member_number}</span>
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm ${
                      member.status === 'active' 
                        ? 'bg-dashboard-accent3/20 text-dashboard-accent3' 
                        : 'bg-dashboard-muted/20 text-dashboard-muted'
                    }`}>
                      {member.status || 'Pending'}
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              
              <AccordionContent>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-dashboard-muted mb-1">Contact Information</p>
                    <p className="text-dashboard-text">{member.email || 'No email provided'}</p>
                    <p className="text-dashboard-text">{member.phone || 'No phone provided'}</p>
                  </div>
                  <div>
                    <p className="text-dashboard-muted mb-1">Address</p>
                    <div className="bg-white/5 p-3 rounded-lg">
                      <p className="text-dashboard-text">
                        {member.address || 'No address provided'}
                        {member.town && `, ${member.town}`}
                        {member.postcode && ` ${member.postcode}`}
                      </p>
                    </div>
                  </div>
                </div>
                
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
                      <p className="text-dashboard-muted mb-1">Status</p>
                      <p className="text-dashboard-text">{member.status || 'Pending'}</p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
      
      <div className="flex justify-between items-center pt-4">
        <Button
          variant="outline"
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className="bg-dashboard-card hover:bg-dashboard-accent1/20"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <span className="text-dashboard-text">
          Page {currentPage + 1} of {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={handleNextPage}
          disabled={currentPage >= totalPages - 1}
          className="bg-dashboard-card hover:bg-dashboard-accent1/20"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default MembersList;