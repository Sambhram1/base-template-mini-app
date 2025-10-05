"use client";

import { useCallback } from "react";
import { PostReactions, ReactionType } from "~/types/luxlink";
import { Heart, Flame, Diamond, MessageCircle, Share } from "lucide-react";

interface ReactionBarProps {
  reactions: PostReactions;
  onReaction: (reaction: ReactionType) => void;
  showComments?: boolean;
  showShare?: boolean;
}

const reactionConfig = {
  love: {
    icon: Heart,
    emoji: "💖",
    activeColor: "text-red-500",
    hoverColor: "hover:text-red-400",
    label: "Love"
  },
  fire: {
    icon: Flame,
    emoji: "🔥", 
    activeColor: "text-orange-500",
    hoverColor: "hover:text-orange-400",
    label: "Fire"
  },
  diamond: {
    icon: Diamond,
    emoji: "💎",
    activeColor: "text-blue-400",
    hoverColor: "hover:text-blue-300",
    label: "Diamond"
  }
};

export function ReactionBar({ 
  reactions, 
  onReaction, 
  showComments = true, 
  showShare = true 
}: ReactionBarProps) {
  
  const handleReaction = useCallback((reactionType: ReactionType) => {
    onReaction(reactionType);
  }, [onReaction]);

  const isUserReacted = (reactionType: ReactionType) => {
    return reactions.userReactions.includes(reactionType);
  };

  const formatCount = (count: number): string => {
    if (count === 0) return "";
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
    return `${(count / 1000000).toFixed(1)}M`;
  };

  return (
    <div className="flex items-center justify-between">
      {/* Reaction Buttons */}
      <div className="flex items-center space-x-1">
        {Object.entries(reactionConfig).map(([key, config]) => {
          const reactionType = key as ReactionType;
          const count = reactions[reactionType];
          const isActive = isUserReacted(reactionType);
          const IconComponent = config.icon;

          return (
            <button
              key={reactionType}
              onClick={() => handleReaction(reactionType)}
              className={`
                flex items-center space-x-1 px-3 py-2 rounded-full transition-all duration-200
                ${isActive 
                  ? `${config.activeColor} bg-gray-800 shadow-md transform scale-105` 
                  : `text-gray-400 ${config.hoverColor} hover:bg-gray-800`
                }
              `}
              title={`${config.label} (${count})`}
            >
              <IconComponent 
                className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`}
                fill={isActive ? "currentColor" : "none"}
              />
              {count > 0 && (
                <span className="text-sm font-medium min-w-[20px] text-center">
                  {formatCount(count)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        {showComments && (
          <button
            className="flex items-center space-x-1 px-3 py-2 rounded-full text-gray-400 hover:text-gold-500 hover:bg-gray-800 transition-all duration-200"
            title="Comments"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Reply</span>
          </button>
        )}

        {showShare && (
          <button
            className="flex items-center space-x-1 px-3 py-2 rounded-full text-gray-400 hover:text-gold-500 hover:bg-gray-800 transition-all duration-200"
            title="Share"
          >
            <Share className="w-5 h-5" />
            <span className="text-sm font-medium">Share</span>
          </button>
        )}
      </div>
    </div>
  );
}