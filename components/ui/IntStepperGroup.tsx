import { Button } from "flowbite-react";

type IntStepperGroupProps = {
  text: string;
  value: number;
  increment: number;
  suffix?: string;
  setValueFunc: (value: number) => void;
};

const IntStepperGroup = ({
  text,
  value = 0,
  increment,
  suffix = "",
  setValueFunc,
}: IntStepperGroupProps) => {
  return (
    <div className="flex rounded-lg items-center dark:bg-gray-700 h-12 gap-2 border border-gray-400">
      <Button
        onClick={() => setValueFunc(value - increment)}
        className="h-full rounded-none rounded-tl-lg rounded-bl-lg border-r-1 dark:border-gray-400 border-l-0 border-t-0 border-b-0 focus:ring-4"
        color="gray"
      >
        <span className="my-auto">-</span>
      </Button>
      <div className="flex-1 text-center">
        <div>{`${value} ${suffix}`}</div>
        <div className="text-gray-400">{text}</div>
      </div>
      <Button
        onClick={() => setValueFunc(value + increment)}
        className="h-full rounded-none rounded-tr-lg rounded-br-lg border-l-1 dark:border-gray-400 border-r-0 border-t-0 border-b-0"
        color="gray"
      >
        <span className="my-auto">+</span>
      </Button>
    </div>
  );
};

export default IntStepperGroup;
