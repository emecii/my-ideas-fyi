export type IdeaTag =
  | "All"
  | "Gen AI"
  | "Web3"
  | "Social Networks"
  | "FinTech"
  | "Developer Tools";

export type IdeaStatus = "planned" | "in-progress" | "live" | "suggestion";

export interface Idea {
  id: string;
  title: string;
  category: IdeaTag;
  upvotes: number;
  status: IdeaStatus;
  description: string;
  commentCount: number;
}

export interface IdeaDetails extends Idea {
  comments?: Comment[];
}

export interface IdeaAPIResponse {
  currentUser: CurrentUser;
  productRequests: ProductRequest[];
}

// TODO: Separate these interfaces into their own files
export interface Vote {
  productRequestId: string;
  voted: "up" | "down";
}

export interface CurrentUser {
  image: string;
  name: string;
  username: string;
  votes?: Vote[];
}

export interface Comment {
  id: string;
  content: string;
  user: User;
  replies?: CommentReply[];
}

export interface CommentReply {
  id: string;
  content: string;
  replyingTo: string;
  user: User;
}

export interface ProductRequest {
  id: string;
  title: string;
  category: IdeaTag;
  upvotes: number;
  status: IdeaStatus;
  description: string;
  comments?: Comment[];
}

export interface User {
  image: string;
  name: string;
  username: string;
}
