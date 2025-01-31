import { Label, TextInput } from "flowbite-react";

type FormTextInputProps = {
  lable: string;
  type: string;
  inputSize: string;
  id: string;
  setNewValue: (event: any) => void;
};

const FormTextInput = ({
  lable,
  type,
  inputSize,
  id,
  setNewValue,
}: FormTextInputProps) => {
  return (
    <div className="flex-1">
      <div className="mb-2 block">
        <Label htmlFor={id} value={lable} className="text-xl" />
      </div>
      <TextInput
        id={id}
        type={type}
        sizing={inputSize}
        color="gray"
        onChange={setNewValue}
      />
    </div>
  );
};

export default FormTextInput;
