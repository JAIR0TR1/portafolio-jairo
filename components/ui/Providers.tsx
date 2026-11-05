"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { useUserReducedEffects } from "@/lib/effects";

/** "always" si el usuario activó "Reducir efectos"; si no, respeta el sistema. */
export function Providers({ children }: { children: ReactNode }) {
  const userReduced = useUserReducedEffects();
  return <MotionConfig reducedMotion={userReduced ? "always" : "user"}>{children}</MotionConfig>;
}
