export interface CreatePostDto {
  title: string;
  description: string;
  category: { Id: string };
  image: string | null;
}
