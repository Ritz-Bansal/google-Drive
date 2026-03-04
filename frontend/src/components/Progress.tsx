import * as React from "react";
import { Progress } from "@/components/ui/progress";

export function ProgressDemo({progress}: {progress: number}) {

  return <Progress value={progress} className="w-[50%] mt-2" />;
}
