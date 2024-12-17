import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { AlertTriangle, Info, CheckCircle2, XCircle } from "lucide-react";

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success:
          "border-emerald-500/50 text-emerald-500 dark:border-emerald-500/30 [&>svg]:text-emerald-500",
        warning:
          "border-yellow-500/50 text-yellow-500 dark:border-yellow-500/30 [&>svg]:text-yellow-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef<HTMLDivElement, { className?: string; variant?: 'default' | 'destructive' | 'success' | 'warning'; icon?: React.ReactNode; children?: React.ReactNode }>(({ className, variant, icon, children, ...props }, ref) => {
  // Icon mapping
  const IconComponent = {
    default: Info,
    destructive: XCircle,
    success: CheckCircle2,
    warning: AlertTriangle,
  }[variant || "default"] as React.ElementType;

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {icon || <IconComponent className="h-4 w-4" />}
      {children}
    </div>
  );
});
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

// Example usage component
const AlertDemo = () => {
  return (
    <div className="space-y-4">
      <Alert>
        <AlertTitle>Default Alert</AlertTitle>
        <AlertDescription>
          This is a default alert with basic styling.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <AlertTitle>Error Alert</AlertTitle>
        <AlertDescription>
          Something went wrong! Please try again.
        </AlertDescription>
      </Alert>

      <Alert variant="success">
        <AlertTitle>Success!</AlertTitle>
        <AlertDescription>
          Your changes have been saved successfully.
        </AlertDescription>
      </Alert>

      <Alert variant="warning">
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Please review your information before proceeding.
        </AlertDescription>
      </Alert>

      {/* Custom icon example */}
      <Alert icon={<Info className="h-4 w-4 text-blue-500" />}>
        <AlertTitle>Custom Icon</AlertTitle>
        <AlertDescription>
          This alert uses a custom icon with custom styling.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export { Alert, AlertTitle, AlertDescription, AlertDemo };