import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string;
  icon?: React.ElementType;
}

export const MetricCard = ({ title, value, icon: Icon }: MetricCardProps) => {
  return (
    <Card>
      <CardContent className="flex items-center p-4 space-x-4">
        {Icon && (
          <div className="p-2 rounded-full bg-primary/10">
            <Icon className="w-4 h-4 text-primary" />
          </div>
        )}
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-lg font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
};
