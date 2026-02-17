"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface LikeDislikeButtonsProps {
  cityId: string;
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
  cityId,
  initialLikes,
  initialDislikes,
  initialUserAction = null,
  onUpdate,
}: LikeDislikeButtonsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userAction, setUserAction] = useState<"like" | "dislike" | null>(initialUserAction);
  const [isPending, setIsPending] = useState(false);

  const updateState = (
    newLikes: number,
    newDislikes: number,
    newUserAction: "like" | "dislike" | null
  ) => {
    setLikes(newLikes);
    setDislikes(newDislikes);
    setUserAction(newUserAction);
    if (onUpdate) onUpdate(newLikes, newDislikes, newUserAction);
  };

  const handleAction = async (action: "like" | "dislike") => {
    if (isPending) return;

    const isSameAction = userAction === action;
    const newAction = isSameAction ? null : action;

    // 낙관적 업데이트: 즉시 UI 반영
    let newLikes = likes;
    let newDislikes = dislikes;
    if (userAction === "like") newLikes -= 1;
    if (userAction === "dislike") newDislikes -= 1;
    if (!isSameAction) {
      if (action === "like") newLikes += 1;
      if (action === "dislike") newDislikes += 1;
    }
    updateState(newLikes, newDislikes, newAction);

    setIsPending(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("handle_city_like", {
        p_city_id: cityId,
        p_old_action: userAction ?? "none",
        p_new_action: newAction ?? "none",
      });

      if (error) {
        // DB 오류 시 낙관적 업데이트 롤백
        updateState(likes, dislikes, userAction);
      } else if (data) {
        // DB에서 반환된 실제 카운트로 동기화
        updateState(data.likes, data.dislikes, newAction);
      }
    } catch {
      updateState(likes, dislikes, userAction);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <Button
        variant="ghost"
        size="sm"
        disabled={isPending}
        onClick={() => handleAction("like")}
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
        disabled={isPending}
        onClick={() => handleAction("dislike")}
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
