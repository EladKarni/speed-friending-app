"use client";
import FormTextInput from "@/components/ui/formTextInput";
import IntStepperGroup from "@/components/ui/IntStepperGroup";
import {
  Button,
  Dropdown,
  DropdownItem,
  FileInput,
  HR,
  Label,
} from "flowbite-react";
import React, { useState } from "react";

const NewEvent = () => {
  const [newEventObject, setNewEventObject] = useState({
    title: "",
    tables: 0,
    eventType: "",
    timers: {
      search: 0,
      chat: 0,
      match: 0,
    },
    mapFile: null,
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
  return (
    <section>
      <h1 className="text-center mb-4">New Event</h1>
      <HR />
      <form
        action={(data) => console.log(data)}
        className="flex flex-col gap-6 mt-4"
      >
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
                    eventType: "Friend",
                  })
                }
              >
                Friend
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  setNewEventObject({
                    ...newEventObject,
                    eventType: "Dating",
                  })
                }
              >
                Dating
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  setNewEventObject({
                    ...newEventObject,
                    eventType: "Other",
                  })
                }
              >
                Other
              </DropdownItem>
            </Dropdown>
            <label className="text-gray-500 text-sm">
              {`Selected Option: ${newEventObject.eventType ? newEventObject.eventType : "None"}`}
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
            text="Match Search Timer"
            value={newEventObject.timers.search}
            setValueFunc={(newValue) => {
              console.log(newValue);
              setTimers("search", (newEventObject.timers.search = newValue));
            }}
          />
          <IntStepperGroup
            text="Match Chat Timer"
            value={newEventObject.timers.chat}
            setValueFunc={(newValue) => {
              console.log(newValue);
              setTimers("chat", (newEventObject.timers.chat = newValue));
            }}
          />
          <IntStepperGroup
            text="Match Post Timer"
            value={newEventObject.timers.match}
            setValueFunc={(newValue) => {
              console.log(newValue);
              setTimers("match", (newEventObject.timers.match = newValue));
            }}
          />
          <div>
            <Label
              htmlFor={"event-type-dropdown"}
              value="Map File"
              className="text-xl"
            />
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
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG
                  </p>
                </div>
                <FileInput id="dropzone-file" className="hidden" />
              </Label>
            </div>
          </div>
        </div>
      </form>
      <div className="flex justify-between">
        <Button
          onClick={() => console.log(newEventObject)}
          className="mt-4"
          color="gray"
        >
          Cancel
        </Button>
        <Button onClick={() => console.log(newEventObject)} className="mt-4">
          Create Event
        </Button>
      </div>
    </section>
  );
};

export default NewEvent;
