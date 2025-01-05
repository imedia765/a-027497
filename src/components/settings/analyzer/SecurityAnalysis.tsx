import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Database, Lock } from "lucide-react";

interface SecurityAnalysisProps {
  dbConfig?: {
    tables: any[];
    policies: any[];
  };
}

const SecurityAnalysis = ({ dbConfig }: SecurityAnalysisProps) => {
  if (!dbConfig) return null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-dashboard-accent1 font-semibold mb-2 flex items-center gap-2">
          <Database className="w-4 h-4" />
          Database Security Analysis
        </h3>
        
        <div className="space-y-4">
          {/* Tables and RLS Status */}
          <div>
            <h4 className="text-dashboard-text mb-2">Tables and RLS Status</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Table Name</TableHead>
                  <TableHead>RLS Enabled</TableHead>
                  <TableHead>Column Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dbConfig.tables.map((table: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{table.name}</TableCell>
                    <TableCell>
                      {table.rls_enabled ? (
                        <span className="text-green-500 flex items-center gap-1">
                          <Shield className="w-4 h-4" />
                          Enabled
                        </span>
                      ) : (
                        <span className="text-red-500 flex items-center gap-1">
                          <Lock className="w-4 h-4" />
                          Disabled
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{table.columns?.length || 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* RLS Policies */}
          <div>
            <h4 className="text-dashboard-text mb-2">RLS Policies</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Table</TableHead>
                  <TableHead>Policy Name</TableHead>
                  <TableHead>Operation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dbConfig.policies.map((policy: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{policy.table_name}</TableCell>
                    <TableCell>{policy.name}</TableCell>
                    <TableCell>{policy.command}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityAnalysis;