"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface LikeDislikeButtonsProps {
  initialLikes: number;
  initialDislikes: number;
  initialUserAction?: "like" | "dislike" | null;
  onUpdate?: (
    likes: number,
    dislikes: number,
    userAction: "like" | "dislike" | null
  ) => void;
}

export function LikeDislikeButtons({
  initialLikes,
  initialDislikes,
  initialUserAction = null,
  onUpdate,
}: LikeDislikeButtonsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userAction, setUserAction] = useState<"like" | "dislike" | null>(initialUserAction);

  const updateState = (
    newLikes: number,
    newDislikes: number,
    newUserAction: "like" | "dislike" | null
  ) => {
    setLikes(newLikes);
    setDislikes(newDislikes);
    setUserAction(newUserAction);

    // 부모 컴포넌트에 변경 알림
    if (onUpdate) {
      onUpdate(newLikes, newDislikes, newUserAction);
    }
  };

  const handleLike = () => {
    // 클릭할 때마다 좋아요 증가 (토글 없음)
    updateState(likes + 1, dislikes, "like");
  };

  const handleDislike = () => {
    // 클릭할 때마다 싫어요 증가 (토글 없음)
    updateState(likes, dislikes + 1, "dislike");
  };

  return (
    <div className="flex items-center justify-between">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        className={
          userAction === "like"
            ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
            : "hover:bg-gray-100"
        }
      >
        👍 {likes}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDislike}
        className={
          userAction === "dislike"
            ? "bg-red-50 text-red-600 hover:bg-red-100"
            : "hover:bg-gray-100"
        }
      >
        👎 {dislikes}
      </Button>
    </div>
  );
}
