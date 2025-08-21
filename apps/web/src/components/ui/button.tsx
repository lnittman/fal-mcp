import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center whitespace-nowrap rounded-[3.75px]",
    "border outline-none",
    "font-medium",
    "disabled:pointer-events-none disabled:opacity-50",
    // fal.ai transition: 0.15s cubic-bezier(0.4, 0, 0.2, 1)
    "transition-all duration-[150ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
    // Prevent mobile long-press bubbles
    "[-webkit-touch-callout:none] [-webkit-user-select:none] [user-select:none]",
    // Svg icons style
    "gap-1.5 [&>svg]:stroke-[1.5] [&>svg]:h-6 [&>svg]:w-6",
  ],
  {
    variants: {
      variant: {
        default: [
          // fal.ai primary button: almost black background, white text
          "bg-[rgb(22,22,24)] text-[rgb(250,250,250)] border-transparent",
          "hover:bg-[rgb(40,40,42)]",
          "[&>svg]:text-[rgb(250,250,250)]",
        ],
        secondary: [
          // fal.ai secondary button: light gray background, dark text
          "bg-[rgb(244,244,245)] text-[rgb(29,29,32)] border-[rgba(22,22,24,0.13)]",
          "hover:bg-[rgb(235,235,237)]",
          "[&>svg]:text-[rgb(29,29,32)]",
        ],
        outline: [
          "bg-transparent text-[rgb(22,22,24)] border-[rgba(22,22,24,0.13)]",
          "hover:bg-[rgb(244,244,245)]",
        ],
        ghost: [
          "bg-transparent text-[rgb(22,22,24)] border-transparent",
          "hover:bg-[rgb(244,244,245)]",
        ],
        link: "text-[rgb(22,22,24)] underline-offset-4 hover:underline border-transparent",
      },
      size: {
        default: "h-[45px] px-[26px] py-[7.5px] text-[1.125rem]",
        sm: "h-[40px] px-[20px] py-[6px] text-[1rem] [&>svg]:h-5 [&>svg]:w-5",
        lg: "h-[50px] px-[32px] py-[10px] text-[1.25rem]",
        xl: "h-[56px] px-[40px] py-[12px] text-[1.375rem]",
        xs: "h-[32px] px-[14px] py-[4px] text-[0.875rem] [&>svg]:h-4 [&>svg]:w-4",
        icon: "h-[45px] w-[45px] [&>svg]:w-5 [&>svg]:h-5 [&>svg]:stroke-current",
        "icon-sm": "h-[40px] w-[40px] [&>svg]:w-4 [&>svg]:h-4 [&>svg]:text-current",
        "icon-xs": "h-[32px] w-[32px] [&>svg]:w-3 [&>svg]:h-3 [&>svg]:text-current",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  customVariant?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, customVariant, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          customVariant,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };