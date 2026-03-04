import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { DriveContext } from "@/store/DriveContext";

// const tags = Array.from({ length: 50 }).map(
//   (_, i, a) => `v1.2.0-beta.${a.length - i}`,
// );
// console.log(tags);

export function ScrollBar() {
    const { files } = React.useContext(DriveContext)!;
    // const tags = files.map((file) => {
    //     {file.id} {file.title} {file.type}
    // });
  return (
    <ScrollArea className="h-72 w-48 rounded-md p-4 w-full">
      <div className="p-4">
        {files.map((file) => (
          <React.Fragment key={file.id}>
            <div className="text-sm">{file.title}</div>
            <Separator className="my-2" />
          </React.Fragment>
        ))}
      </div>
    </ScrollArea>
  );
}
