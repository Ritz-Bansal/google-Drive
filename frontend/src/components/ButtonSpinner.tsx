import { LoaderIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-5 animate-spin", className)}
      {...props}
    />
  );
}

export function ButtonSpinner() {
  return (
    <div className="flex justify-center items-center gap-4 p-1">
      <Spinner />
    </div>
  );
}
