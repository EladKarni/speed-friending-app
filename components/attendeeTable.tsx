import { Table, TableHead, TableHeadCell, TableBody } from "flowbite-react";
import TableEntry from "./ui/tableEntry";
import { EventAttendeesType } from "@/utils/store/useEventStore";

type AttendeeTableProps = {
  event_attendees: EventAttendeesType[];
  readyAttendees: string[];
};

const AttendeeTable = ({
  event_attendees,
  readyAttendees,
}: AttendeeTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHead>
          <TableHeadCell>Name</TableHeadCell>
          <TableHeadCell>Ready</TableHeadCell>
          <TableHeadCell>Ticket</TableHeadCell>
          <TableHeadCell>
            <span className="sr-only">Edit</span>
          </TableHeadCell>
        </TableHead>
        <TableBody className="divide-y">
          {event_attendees && event_attendees.length > 0 ? (
            event_attendees.map(({ name, id, ticketAs }) => (
              <TableEntry
                name={name}
                ready={readyAttendees.includes(id)}
                ticket={ticketAs}
                key={id}
              />
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
  );
};

export default AttendeeTable;
