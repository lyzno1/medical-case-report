"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ButtonProps } from "@/components/ui/button"

interface MobileOptimizedButtonProps extends ButtonProps {
  children: React.ReactNode
}

export function MobileOptimizedButton({ children, className, ...props }: MobileOptimizedButtonProps) {
  return (
    <Button
      className={cn(
        "touch-manipulation", // 防止双击缩放
        "active:scale-95", // 触摸反馈
        "transition-transform duration-150", // 平滑动画
        "min-h-[44px]", // 确保足够的触摸区域
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  )
}
