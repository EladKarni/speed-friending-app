"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  Dropdown,
  DropdownItem,
  Table,
  TableBody,
  TableHead,
  TableHeadCell,
} from "flowbite-react";
import { HiShare, HiChevronDown } from "react-icons/hi";

import React from "react";
import TableEntry from "@/components/ui/tableEntry";

const GuestList = () => {
  return (
    <Card>
      <form className="w-full mx-auto flex flex-col gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 end-4 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search Guest List"
            required
          />
        </div>
      </form>
      <Button variant="primary">Show QR</Button>
      <div className="flex gap-4">
        <Dropdown
          label=""
          dismissOnClick={false}
          renderTrigger={() => (
            <Button variant="ghost" className="border border-gray-500 w-full">
              <HiChevronDown size={24} /> Actions
            </Button>
          )}
        >
          <DropdownItem>Friend</DropdownItem>
          <DropdownItem>Dating</DropdownItem>
          <DropdownItem>Other</DropdownItem>
        </Dropdown>
        <Button>
          <HiShare />
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHead>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Visit</TableHeadCell>
            <TableHeadCell>Anon</TableHeadCell>
            <TableHeadCell>
              <span className="sr-only">Edit</span>
            </TableHeadCell>
          </TableHead>
          <TableBody className="divide-y">
            <TableEntry name="John Doe" visit={1} isAnon={false} />
            <TableEntry name="Jane Doe" visit={2} isAnon={true} />
            <TableEntry name="John Smith" visit={3} isAnon={false} />
            <TableEntry name="Jane Smith" visit={4} isAnon={true} />
            <TableEntry name="John Johnson" visit={5} isAnon={false} />
            <TableEntry name="Jane Johnson" visit={6} isAnon={true} />
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default GuestList;
