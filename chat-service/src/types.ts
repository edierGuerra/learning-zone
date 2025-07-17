export interface Comment {
  id: number;
  user: string;
  text: string;
  timestamp: string;
  parentId: number | null;
  courseId: number;
}
