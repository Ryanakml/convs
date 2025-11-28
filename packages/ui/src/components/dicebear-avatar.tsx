"use client";

import { useMemo } from "react";
import { glass } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { Avatar, AvatarImage } from "@workspace/ui/components/avatar";
import { cn } from "@workspace/ui/lib/utils";

interface DicebearAvatarProps {
  seed: string;
  className?: string;
  size?: number;
  badgeClassName?: string;
  imageUrl?: string;
  badgeImageUrl?: string;
}
export function AvatarWithBadge({
  seed,
  className,
  size = 48,
  badgeClassName,
  imageUrl,
  badgeImageUrl,
}: DicebearAvatarProps) {
  const avatarSrc = useMemo(() => {
    if (imageUrl) {
      return imageUrl;
    }

    const avatar = createAvatar(glass, {
      seed: seed.toLowerCase().trim(),
      size,
    });
    return avatar.toDataUri();
  }, [seed, size]);

  const badgeSize = Math.round(size * 0.5);

  return (
    <div
      className="relative inline-block"
      style={{ width: size, height: size }}
    >
      <Avatar
        className={cn("border", className)}
        style={{ width: size, height: size }}
      >
        <AvatarImage alt="Image" src={avatarSrc} />
      </Avatar>

      {badgeImageUrl && (
        <div
          className={cn(
            "absolute right-0 bottom-0 flex items-center justify-center overflow-hidden rounded-full border-2 border-background bg-background",
            badgeClassName
          )}
          style={{
            width: badgeSize,
            height: badgeSize,
            transform: "translate(15%, 15%)",
          }}
        >
          <img
            alt="Badge"
            src={badgeImageUrl}
            height={badgeSize}
            width={badgeSize}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
