export interface CreatePostDto {
  title: string;
  description: string;
  category: { id: string };
  image: string | null;
}
