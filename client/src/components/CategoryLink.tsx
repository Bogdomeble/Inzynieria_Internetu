// client/src/components/CategoryLink.tsx
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "../lib/api";

interface CategoryLinkProps {
  categoryId: string;
}

export function CategoryLink({ categoryId }: CategoryLinkProps) {
  const { data: category } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => categoriesApi.getById(categoryId),
  });

  if (!category) return null;

  return (
    <Link
      to={`/categories/${category.slug}`}
      className="text-sm font-semibold uppercase tracking-wider text-primary-600 hover:text-primary-700"
    >
      {category.name}
    </Link>
  );
}
