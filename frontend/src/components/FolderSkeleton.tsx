import { Skeleton } from "@/components/ui/skeleton";

export function FolderSkeleton() {
  return (
    <div className="flex w-full h-full pr-2 flex-col gap-2">
      <Skeleton className="h-28 w-full" />
    </div>
  );
}
