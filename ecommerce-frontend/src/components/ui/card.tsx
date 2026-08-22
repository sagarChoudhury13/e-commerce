import * as React from "react"

import { cn } from "@/lib/utils"

function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "tw-:group/card tw-:flex tw-:flex-col tw-:gap-(--card-spacing) tw-:overflow-hidden tw-:rounded-4xl tw-:bg-card tw-:py-(--card-spacing) tw-:text-sm tw-:text-card-foreground tw-:shadow-md tw-:ring-1 tw-:ring-foreground/5 tw-:[--card-spacing:--spacing(6)] tw-:has-[>img:first-child]:pt-0 tw-:data-[size=sm]:[--card-spacing:--spacing(4)] tw-:dark:ring-foreground/10 tw-:*:[img:first-child]:rounded-t-4xl tw-:*:[img:last-child]:rounded-b-4xl",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "tw-:group/card-header tw-:@container/card-header tw-:grid tw-:auto-rows-min tw-:items-start tw-:gap-1.5 tw-:rounded-t-4xl tw-:px-(--card-spacing) tw-:has-data-[slot=card-action]:grid-cols-[1fr_auto] tw-:has-data-[slot=card-description]:grid-rows-[auto_auto] tw-:[.border-b]:pb-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("tw-:font-heading tw-:text-base tw-:font-medium", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("tw-:text-sm tw-:text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "tw-:col-start-2 tw-:row-span-2 tw-:row-start-1 tw-:self-start tw-:justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("tw-:px-(--card-spacing)", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "tw-:flex tw-:items-center tw-:rounded-b-4xl tw-:px-(--card-spacing) tw-:[.border-t]:pt-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
