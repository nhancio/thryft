import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        "condition-new": "border-primary/30 bg-primary/20 text-foreground",
        "condition-like-new": "border-sage/40 bg-sage/30 text-foreground",
        "condition-gently-used": "border-accent/30 bg-peach-soft text-foreground",
        "condition-worn": "border-muted-foreground/30 bg-muted text-muted-foreground",
        era: "border-foreground/20 bg-foreground/5 text-foreground",
        sale: "border-destructive/30 bg-destructive/10 text-destructive",
        verified: "border-primary/30 bg-primary/10 text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
