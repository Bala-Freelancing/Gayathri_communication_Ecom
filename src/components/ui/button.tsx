import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-neutral-900 text-white shadow-sm hover:bg-neutral-800 focus-visible:ring-neutral-900 font-medium",
        destructive:
          "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 font-medium",
        outline:
          "border border-neutral-300 bg-white text-neutral-800 shadow-sm hover:bg-neutral-50 hover:border-neutral-400 font-medium",
        secondary:
          "bg-neutral-100 text-neutral-900 border border-neutral-200/80 hover:bg-neutral-200/70 font-medium",
        ghost: "hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900 font-medium",
        link: "text-blue-700 underline-offset-4 hover:underline font-medium",
        gold: "bg-amber-600 text-white font-medium hover:bg-amber-700 shadow-sm",
        whatsapp: "bg-[#25D366] text-white font-medium hover:bg-[#20ba59] shadow-sm",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-lg px-3.5 text-xs",
        lg: "h-12 rounded-xl px-8 text-base font-semibold",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
