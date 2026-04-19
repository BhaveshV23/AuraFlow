interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full glass px-4 py-4 mb-6 border-b border-border/50">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-foreground drop-shadow-sm">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
    </header>
  );
}
