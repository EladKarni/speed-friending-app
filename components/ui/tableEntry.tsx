import { TableRow, TableCell } from "flowbite-react";
import { Button } from "./button";
import { FaGear } from "react-icons/fa6";
import { cn } from "@/lib/utils";

type TableEntryProps = {
  name: string;
  ready: boolean;
  ticket: string;
};

const TableEntry = ({ name, ready, ticket }: TableEntryProps) => {
  return (
    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
      <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {name}
      </TableCell>
      <TableCell className={cn(ready ? "text-green-400" : "text-red-400")}>
        {ready ? "Yes" : "No"}
      </TableCell>
      <TableCell>{ticket}</TableCell>
      <TableCell>
        <Button variant="ghost" className="flex justify-end w-full">
          <FaGear />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default TableEntry;
