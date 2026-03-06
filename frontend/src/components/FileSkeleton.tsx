import { Skeleton } from "@/components/ui/skeleton";

export function FileSkeleton() {
    {console.log("Insde the skeleton")}
  return (
    <div className="flex w-full h-full pr-2 flex-col gap-2">
      <Skeleton className="h-8 w-full mt-5" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
  );
}
