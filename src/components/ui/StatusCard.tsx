import { ReactNode } from "react";
import { AlertCircle, CheckCircle2, AlertTriangle, Clock } from "lucide-react";

export type StatusType = "normal" | "warning" | "critical" | "info";

interface StatusCardProps {
  title: string;
  value: string | ReactNode;
  status?: StatusType;
  description?: string;
  icon?: ReactNode;
  className?: string;
}

export function StatusCard({
  title,
  value,
  status = "normal",
  description,
  icon,
  className = "",
}: StatusCardProps) {
  const statusStyles = {
    normal: "border-success/30 bg-success/5",
    warning: "border-warning/50 bg-warning/10 shadow-[0_0_15px_rgba(234,179,8,0.1)]",
    critical: "border-destructive/50 bg-destructive/10 shadow-[0_0_15px_rgba(239,68,68,0.15)]",
    info: "border-primary/30 bg-primary/5",
  };

  const statusIcons = {
    normal: <CheckCircle2 className="w-4 h-4 text-success" />,
    warning: <AlertTriangle className="w-4 h-4 text-warning" />,
    critical: <AlertCircle className="w-4 h-4 text-destructive" />,
    info: <Clock className="w-4 h-4 text-primary" />,
  };

  return (
    <div
      className={`rounded-xl border p-4 transition-all duration-300 relative overflow-hidden ${statusStyles[status]} ${className}`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </h3>
        <div className="p-1.5 rounded-full glass">
          {icon || statusIcons[status]}
        </div>
      </div>
      
      <div className="flex flex-col">
        <div className="text-2xl font-bold tracking-tight text-foreground">
          {value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </div>
      
      {/* Decorative accent line */}
      <div className={`absolute bottom-0 left-0 h-1 w-full opacity-50 ${
        status === 'normal' ? 'bg-success' : 
        status === 'warning' ? 'bg-warning' : 
        status === 'critical' ? 'bg-destructive' : 'bg-primary'
      }`} />
    </div>
  );
}
