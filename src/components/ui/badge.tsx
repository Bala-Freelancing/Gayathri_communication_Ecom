import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-neutral-100 text-neutral-800 border border-neutral-200/80 font-medium",
        secondary:
          "bg-neutral-50 text-neutral-600 border border-neutral-200/60 font-medium",
        destructive:
          "bg-red-50 text-red-700 border border-red-200 font-medium",
        outline: "text-neutral-700 border-neutral-300 bg-white font-medium",
        discount:
          "bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold",
        gold:
          "bg-amber-50 text-amber-900 border border-amber-200 font-semibold",
        glow:
          "bg-neutral-900 text-white border border-neutral-800 shadow-sm font-medium tracking-wide",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
