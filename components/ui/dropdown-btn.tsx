"use client";
import { Dropdown, DropdownItem } from "flowbite-react";
import { ComponentProps } from "react";

type DropdownBtnProps = ComponentProps<typeof Dropdown> & {
  options: string[];
  btnRender: React.ReactElement;
};

const DropdownBtn = ({ options, btnRender, ...props }: DropdownBtnProps) => {
  return (
    <Dropdown
      label=""
      dismissOnClick={false}
      renderTrigger={() => btnRender}
      {...props}
    >
      {options.map((option) => (
        <DropdownItem>{option}</DropdownItem>
      ))}
    </Dropdown>
  );
};

export default DropdownBtn;
