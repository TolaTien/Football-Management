export type ForumPostStatus = 'approved' | 'pending' | 'rejected';

export interface ForumPost {
  id: string;
  title: string;
  author: string;
  date: string;
  category: string;
  status: ForumPostStatus;
  content: string;
}

export interface CreateForumPostDto {
  title: string;
  author: string;
  category: string;
  content: string;
}
