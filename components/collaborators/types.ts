export type CollaboratorStatus = "active" | "pending";

export type Collaborator = {
  id: string;
  name: string;
  email: string;
  status: CollaboratorStatus;
  invitedAt: string;
};

export type NewCollaboratorData = {
  name: string;
  email: string;
};
