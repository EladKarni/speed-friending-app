import { TableRow, TableCell } from "flowbite-react";
import { Button } from "./button";
import { FaGear } from "react-icons/fa6";

type TableEntryProps = {
  name: string;
  visit: number;
  isAnon: boolean;
};

const TableEntry = ({ name, visit, isAnon }: TableEntryProps) => {
  return (
    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
      <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {name}
      </TableCell>
      <TableCell>{visit}st</TableCell>
      <TableCell>{isAnon ? "Yes" : "No"}</TableCell>
      <TableCell>
        <Button variant="ghost" className="flex justify-end w-full">
          <FaGear />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default TableEntry;
