import { toast } from "@/hooks/use-toast";

/**
 * Helper to provide consistent feedback for features that are not yet implemented.
 * Keeps UI responsive (no dead buttons) without altering existing layouts.
 */
export function comingSoon(feature?: string) {
  toast({
    title: feature ? `${feature} – Coming Soon` : "Coming Soon",
    description: "This action is not yet available. It will be implemented in a future update.",
  });
}
