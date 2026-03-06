import { Skeleton } from "@/components/ui/skeleton";

export function AvatarSkeleton() {
  return (
    <div className="flex w-fit items-center  gap-4">
      <div className="grid gap-2">
        <Skeleton className="h-5 w-[100px]" />
      </div>
      <Skeleton className="size-8 shrink-0 rounded-full" />
    </div>
  );
}
