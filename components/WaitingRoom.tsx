import { Button, Progress } from "flowbite-react";
import React from "react";

const WaitingRoom = () => {
  return (
    <div>
      {" "}
      <h2>Waiting for the round to start</h2>
      <Progress progress={45} />
      <div className="flex gap-4">
        <Button className="flex-1">Skip Next Round</Button>
        <Button className="flex-1">Leave Event</Button>
      </div>
    </div>
  );
};

export default WaitingRoom;
