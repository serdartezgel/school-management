import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

interface StatCardProps {
  title: string;
  value: number;
  description?: string;
  color?: "green" | "red" | "yellow" | "blue" | "primary" | "secondary";
}

const StatCard = ({
  title,
  value,
  description,
  color = "blue",
}: StatCardProps) => {
  const colorClasses: Record<string, string> = {
    green: "text-green-600",
    red: "text-red-600",
    yellow: "text-yellow-600",
    blue: "text-blue-600",
    primary: "text-primary",
    secondary: "text-secondary",
  };

  return (
    <Card className="min-w-[180px] flex-1">
      <CardHeader>
        <CardTitle className="font-medium capitalize">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</p>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
