export type CollaboratorRole = "admin" | "collaborator";

export interface Collaborator {
  id: string;
  created_at: Date;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
  whatsapp: string | null;
  role: CollaboratorRole;
  company_id: string;
  company_member_area_id: string | null;
}

export interface CollaboratorArea {
  id: string;
  created_at: Date;
  company_id: string;
  name: string;
}
