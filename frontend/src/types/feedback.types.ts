export interface FeedbackAuthor {
  _id: string;
  fullName: string;
  avatar?: string;
}

export interface EquipmentFeedback {
  _id: string;
  equipment: string;
  user: FeedbackAuthor;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeedbackInput {
  rating: number;
  comment: string;
}
