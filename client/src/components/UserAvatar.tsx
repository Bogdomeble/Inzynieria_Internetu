import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useMemo } from "react";

interface UserAvatarProps {
  userId: string;
  size?: "sm" | "md" | "lg";
}

export function UserAvatar({ userId, size = "md" }: UserAvatarProps) {
  const { data: user } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return {
        id: userId,
        username: "User" + userId.slice(0, 4),
        avatar: `https://api.dicebear.com/7.x/avatars/svg?seed=${userId}`,
      };
    },
  });

  const dimensions = useMemo(() => {
    switch (size) {
      case "sm":
        return "h-6 w-6";
      case "lg":
        return "h-12 w-12";
      default:
        return "h-8 w-8";
    }
  }, [size]);

  if (!user) return null;

  return (
    <Link to={`/users/${userId}`} className="group flex items-center gap-2">
      <img
        src={user.avatar}
        alt={user.username}
        className={`${dimensions} rounded-full transition-transform group-hover:scale-110`}
      />
      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
        {user.username}
      </span>
    </Link>
  );
}
