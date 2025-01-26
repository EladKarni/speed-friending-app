"use client";
import { Button } from "flowbite-react";
import React from "react";

type ConfirmPromptProps = {
  handleCancel?: () => void;
  handleConfirm?: () => void;
  ConfirmBtnType: "button" | "submit" | "reset";
  cancleText: string;
  confirmText: string;
};

const ConfirmPrompt = ({
  handleCancel,
  handleConfirm,
  ConfirmBtnType,
  cancleText,
  confirmText,
}: ConfirmPromptProps) => {
  return (
    <div className="flex justify-between gap-4">
      <Button onClick={handleCancel} className="mt-4 flex-1" color="gray">
        {cancleText}
      </Button>
      <Button
        type={ConfirmBtnType}
        className="mt-4 flex-1"
        onClick={handleConfirm}
      >
        {confirmText}
      </Button>
    </div>
  );
};

export default ConfirmPrompt;
