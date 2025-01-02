import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Database } from '@/integrations/supabase/types';

type Collector = Database['public']['Tables']['collectors']['Row'];

const CollectorsList = () => {
  const { data: collectors, isLoading, error } = useQuery({
    queryKey: ['collectors'],
    queryFn: async () => {
      console.log('Fetching collectors...');
      const { data, error } = await supabase
        .from('collectors')
        .select('*')
        .order('number', { ascending: true })
        .throwOnError();
      
      if (error) {
        console.error('Error fetching collectors:', error);
        throw error;
      }
      
      return data as Collector[];
    },
  });

  if (isLoading) return <div className="text-center py-4">Loading collectors...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error loading collectors: {error.message}</div>;
  if (!collectors?.length) return <div className="text-center py-4">No collectors found</div>;

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {collectors.map((collector) => (
          <div 
            key={collector.id} 
            className="bg-dashboard-card p-4 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white">
                  {collector.prefix}
                </div>
                <div>
                  <p className="font-medium text-white">{collector.name}</p>
                  <p className="text-sm text-dashboard-text">#{collector.number.padStart(2, '0')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1 rounded-full ${
                  collector.active 
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {collector.active ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectorsList;