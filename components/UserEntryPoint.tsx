"use client";

import { AnonSignInAction } from "@/app/actions";
import { Button, Label, Select } from "flowbite-react";
import { SubmitButton } from "./submit-button";
import { Input } from "./ui/input";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import React from "react";

interface EventData {
  event_type: "Friending" | "Dating" | "Other";
}

const UserEntryPoint = () => {
  const searchParams = useSearchParams();
  const event_id = searchParams.get("event_id");

  const [eventData, setEventData] = useState<EventData | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (event_id) {
        const supabase = await createClient();
        let { data: event, error } = await supabase
          .from("events")
          .select("*")
          .eq("id", event_id);
        if (event) {
          setEventData(event[0]);
        }
      }
    };
    fetchEvent();
  }, []);

  return (
    <div className="w-64 text-center mx-auto">
      <Link href="/sign-in">
        <Button className="mx-auto w-44">Signup / Login</Button>
      </Link>
      <hr className="h-1 mx-auto my-4 bg-gray-100 border-0 rounded md:my-10 dark:bg-gray-700" />
      <form className="w-44 text-center mx-auto flex gap-4 flex-col">
        <Input type="text" name="name" placeholder="Your Name" required />
        {eventData?.event_type === "Dating" && (
          <>
            <Input type="text" name="email" placeholder="Your Email" required />
            <div className="max-w-md">
              <div className="mb-2 block">
                <Label htmlFor="gender" value="Select your ticket" />
              </div>
              <Select name="gender" id="gender" required>
                <option value="Women">Women’s Ticket</option>
                <option value="Men">Men's Ticket</option>
              </Select>
            </div>

            {event_id && (
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="event" value="Event Code" />
                </div>
                <Input
                  type="text"
                  name="event"
                  id="event"
                  value={event_id}
                  readOnly
                />
              </div>
            )}
          </>
        )}
        <SubmitButton pendingText="Signing In..." formAction={AnonSignInAction}>
          Continue Without User
        </SubmitButton>
      </form>
    </div>
  );
};

export default UserEntryPoint;
