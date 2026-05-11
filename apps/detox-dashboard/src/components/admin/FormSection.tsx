import { Card, CardContent } from "@urbandetox/ui";

interface FormSectionProps {
  title?: string;
  children: React.ReactNode;
}

export function FormSection({ title, children }: FormSectionProps) {
  return (
    <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
      <CardContent className="p-6">
        {title && (
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">{title}</h3>
        )}
        {children}
      </CardContent>
    </Card>
  );
}
