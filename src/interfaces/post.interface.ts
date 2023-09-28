export interface CreatePostDto {
  title: string;
  description: string;
  category: string;
  image: string | null;
  interactions: boolean;
}
