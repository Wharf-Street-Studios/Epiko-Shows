import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <motion.div 
      initial={false}
      animate={{ scale: 1 }}
      whileFocus={{ scale: 1.01 }}
      className="relative w-full"
    >
      <input
        type={type}
        className={cn(
          "flex w-full rounded-xl border border-input bg-background px-4 py-3 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          className
        )}
        ref={ref}
        {...props}
      />
    </motion.div>
  )
})
Input.displayName = "Input"

export { Input }
