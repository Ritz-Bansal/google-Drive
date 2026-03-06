import { LoaderIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-2.75 animate-spin", className)}
      {...props}
    />
  );
}

interface IButtonSpinner{
  isDialog?: boolean;
}

export function ButtonSpinner({isDialog}: IButtonSpinner) {
  return (
    <div className={`flex text-sm justify-center items-center gap-4 ${isDialog? "" : "p-1"}`}>
      <Spinner className={isDialog ? "size-2.75" : "size-5"}/>
    </div>
  );
}
