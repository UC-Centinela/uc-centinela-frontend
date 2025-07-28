import { Card, CardContent } from "@/components/ui/card";
import type { TaskStatusData } from "@/types/task";
import { cn } from "@/lib/utils";

interface TaskSummaryCardsProps {
  data: TaskStatusData[];
}

const defaultStatusData: TaskStatusData[] = [
  {
    status: ["PENDING", "IN_PROGRESS"],
    label: "Asignadas",
    count: 0,
    color: "#f59e0b",
  },
  {
    status: ["COMPLETED"],
    label: "En revisión",
    count: 0,
    color: "#3b82f6",
  },
  {
    status: ["REVIEWED"],
    label: "Aprobadas",
    count: 0,
    color: "#10b981",
  },
];

export function TaskSummaryCards({ data }: TaskSummaryCardsProps) {
  // Combinar los datos proporcionados con los datos por defecto
  const mergedData = [
    ...defaultStatusData.map((defaultItem) => {
      const matchingItem = data.find(
        (item) =>
          JSON.stringify(item.status.sort()) ===
          JSON.stringify(defaultItem.status.sort())
      );
      return matchingItem
        ? { ...defaultItem, count: matchingItem.count }
        : defaultItem;
    }),
    // Agrega cualquier estado extra (como 'Rechazadas') que no esté en defaultStatusData
    ...data.filter(
      (item) =>
        !defaultStatusData.some(
          (def) =>
            JSON.stringify(def.status.sort()) ===
            JSON.stringify(item.status.sort())
        )
    ),
  ];

  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium mb-3">Resumen de Tareas</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {mergedData.map((item) => (
          <Card
            key={item.status.join("-")}
            className={cn(
              "border-l-4 hover:bg-accent/5 transition-colors",
              "cursor-pointer"
            )}
            style={{ borderLeftColor: item.color }}
          >
            <CardContent className="p-4">
              <p className="text-sm font-medium text-muted-foreground">
                {item.label}
              </p>
              <p className="text-2xl font-bold mt-1">{item.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
