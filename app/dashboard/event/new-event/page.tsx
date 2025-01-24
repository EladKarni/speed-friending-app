"use client";

import FormTextInput from "@/components/ui/formTextInput";
import IntStepperGroup from "@/components/ui/IntStepperGroup";
import { createClient } from "@/utils/supabase/client";
import {
  Button,
  Dropdown,
  DropdownItem,
  FileInput,
  HR,
  Label,
} from "flowbite-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const NewEvent = () => {
  const router = useRouter();

  const [newEventObject, setNewEventObject] = useState({
    title: "New Event",
    tables: 0,
    type: "",
    timers: {
      start: 0,
      search: 0,
      chat: 0,
      wrapup: 0,
    },
    mapFile: null as File | null,
  });

  const setTimers = (timerType: string, newValue: number) => {
    if (newValue < 0) {
      newValue = 0;
    }
    setNewEventObject({
      ...newEventObject,
      timers: {
        ...newEventObject.timers,
        [timerType]: newValue,
      },
    });
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (files[0] !== null) {
        setNewEventObject({
          ...newEventObject,
          mapFile: files[0],
        });
      }
    }
  };

  const handleSubmit = async () => {
    const supabase = createClient();
    const mapFile = newEventObject.mapFile;
    if (!mapFile) {
      return;
    }
    const uploadData = await supabase.storage
      .from("event-maps")
      .upload(`public/event_${newEventObject.title}_map_file_.png`, mapFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadData.error) {
      console.error("upload file: ", uploadData.error);
      return;
    }

    const { data, error } = await supabase
      .from("events")
      .insert([
        {
          event_name: newEventObject.title,
          tables: newEventObject.tables,
          event_type: newEventObject.type,
          timer_start: newEventObject.timers["start"],
          timer_search: newEventObject.timers["search"],
          timer_chat: newEventObject.timers["chat"],
          timer_wrapup: newEventObject.timers["wrapup"],
          event_map: uploadData.data.fullPath,
        },
      ])
      .select();

    if (error) {
      console.error("insert event: ", error);
      return;
    }
    router.push("/dashboard/event?event_id=" + data[0].id);
  };

  return (
    <section>
      <h1 className="text-center mb-4">New Event</h1>
      <HR />
      <form action={handleSubmit} className="flex flex-col gap-6 mt-4">
        <FormTextInput
          lable={"Title"}
          type={"text"}
          inputSize={"md"}
          id={"title"}
          setNewValue={(event) =>
            setNewEventObject({
              ...newEventObject,
              title: event.target.value,
            })
          }
        />
        <FormTextInput
          lable={"Tables"}
          type={"number"}
          inputSize={"md"}
          id={"title"}
          setNewValue={(event) =>
            setNewEventObject({
              ...newEventObject,
              tables: parseInt(event.target.value),
            })
          }
        />
        <div>
          <div className="mb-2 block">
            <Label
              htmlFor={"event-type-dropdown"}
              value="Event Type"
              className="text-xl"
            />
          </div>
          <div className="flex gap-4">
            <Dropdown label="Dropdown button" dismissOnClick={false}>
              <DropdownItem
                onClick={() =>
                  setNewEventObject({
                    ...newEventObject,
                    type: "Friend",
                  })
                }
              >
                Friend
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  setNewEventObject({
                    ...newEventObject,
                    type: "Dating",
                  })
                }
              >
                Dating
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  setNewEventObject({
                    ...newEventObject,
                    type: "Other",
                  })
                }
              >
                Other
              </DropdownItem>
            </Dropdown>
            <label className="text-gray-500 text-sm">
              {`Selected Option: ${newEventObject.type ? newEventObject.type : "None"}`}
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="block">
            <Label
              htmlFor={"event-type-dropdown"}
              value="Timers"
              className="text-xl"
            />
          </div>
          <IntStepperGroup
            text="Match Starting Timer"
            value={newEventObject.timers.start}
            increment={15}
            suffix="sec"
            setValueFunc={(newValue) => {
              setTimers("start", (newEventObject.timers.start = newValue));
            }}
          />
          <IntStepperGroup
            text="Match Search Timer"
            value={newEventObject.timers.search}
            increment={30}
            suffix="sec"
            setValueFunc={(newValue) => {
              setTimers("search", (newEventObject.timers.search = newValue));
            }}
          />
          <IntStepperGroup
            text="Match Chat Timer"
            value={newEventObject.timers.chat}
            increment={1}
            suffix="min"
            setValueFunc={(newValue) => {
              setTimers("chat", (newEventObject.timers.chat = newValue));
            }}
          />
          <IntStepperGroup
            text="Match Wrapup Timer"
            value={newEventObject.timers.wrapup}
            increment={30}
            suffix="sec"
            setValueFunc={(newValue) => {
              setTimers("wrapup", (newEventObject.timers.wrapup = newValue));
            }}
          />
          <div>
            <Label
              htmlFor={"event-type-dropdown"}
              value="Map File"
              className="text-xl"
            />
            {newEventObject.mapFile ? (
              <div className="relative flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <Image
                  src={URL.createObjectURL(newEventObject.mapFile)}
                  alt="Event Map"
                  fill
                />
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
                  onClick={() =>
                    setNewEventObject({ ...newEventObject, mapFile: null })
                  }
                >
                  <div className="text-white">Remove Map</div>
                </div>
              </div>
            ) : (
              <div className="flex w-full items-center justify-center mt-2">
                <Label
                  htmlFor="dropzone-file"
                  className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                  <div className="flex flex-col items-center justify-center pb-6 pt-5">
                    <svg
                      className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG
                    </p>
                  </div>
                  <FileInput
                    id="dropzone-file"
                    className="hidden"
                    onChange={handleFileSelected}
                  />
                </Label>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <Button
            onClick={() => console.log(newEventObject)}
            className="mt-4"
            color="gray"
          >
            Cancel
          </Button>
          <Button type="submit" className="mt-4">
            Create Event
          </Button>
        </div>
      </form>
    </section>
  );
};

export default NewEvent;
