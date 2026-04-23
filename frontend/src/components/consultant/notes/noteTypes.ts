export type NoteStatus = "Follow-up Required" | "Completed" | "Pending Review";

export type BackendNoteItem = {
  id: string;
  clientName: string;
  clientAvatar: string;
  noteDate: string;
  title: string;
  summary: string;
  lastUpdated: string;
  status: NoteStatus;
  clientSummary: {
    age: string;
    gender: string;
    goals: string;
  };
  sessionObservations: string[];
  foodRestrictions: string[];
  recommendations: string[];
  followUpInstructions: string[];
};
