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

import React, { use, useEffect, useState } from "react";
import TableEntry from "@/components/ui/tableEntry";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

const GuestList = () => {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const event_id = searchParams.get("event_id");

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchEventInfo = async () => {
      if (!event_id) {
        return;
      }
      const { data: events, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", event_id);

      if (error) {
        console.error(error);
      }

      if (events && events.length > 0) {
        console.log(events[0]);
      }
    };
    fetchEventInfo();
  }, [event_id]);

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
      <Link
        href={`/dashboard/event/share?event_id=${event_id}`}
        className="text-white text-center w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Show QR
      </Link>
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
            {users.length > 0 ? (
              users.map((user) => (
                // <TableEntry key={user.id} user={user} />
                <TableEntry name="John Doe" visit={1} isAnon={false} />
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center p-4">
                  This event has no users
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default GuestList;
