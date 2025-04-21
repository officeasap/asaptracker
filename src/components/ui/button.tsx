
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[15px] text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#8B0000] text-white hover:bg-[#A80000] hover:shadow-[0_0_8px_#A80000]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-[#8B0000] bg-background hover:bg-[#8B0000]/10 hover:text-white",
        secondary:
          "bg-[#1A1A1A] text-white hover:bg-[#2B2B2B] border border-[#8B0000]",
        ghost: "hover:bg-[#8B0000]/10 hover:text-white",
        link: "text-[#8B0000] underline-offset-4 hover:underline",
        contact: "bg-[#8B0000] hover:bg-[#A80000] text-white border border-[#8B0000] rounded-[15px] hover:shadow-[0_0_8px_#A80000]",
        subscribe: "bg-[#8B0000] hover:bg-[#A80000] text-white rounded-[15px] hover:shadow-[0_0_8px_#A80000]",
        nav: "bg-[#8B0000] border border-[#8B0000] text-white hover:bg-[#A80000] rounded-[15px] hover:shadow-[0_0_8px_#A80000]",
        redGradient: "bg-[#8B0000] text-white hover:bg-[#A80000] rounded-[15px] hover:shadow-[0_0_8px_#A80000]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        compact: "h-8 px-3 py-1 text-sm",
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
