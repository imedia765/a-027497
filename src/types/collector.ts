export interface Collector {
  id: string;
  name: string;
  prefix: string;
  number: string;
  email: string | null;
  phone: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
  member_number: string | null;
  auth_user_id?: string | null;
  memberCount?: number;
}