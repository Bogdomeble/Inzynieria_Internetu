export class CreatePostDto {
  title: string;
  content: string;
  slug: string;
  excerpt?: string;
  published?: boolean;
  featuredImage?: string;
  authorId: string;
  categoryId: string;
}