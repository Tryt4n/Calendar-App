import { ChangeEvent } from "react";

type TextInputPropsType = {
  name: string;
  isRequired?: boolean;
  minLength?: number;
  maxLength?: number;
  disabledStatus?: boolean;
  inputValue: string;
  onChangeFunction: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function TextInput({
  name,
  isRequired = false,
  minLength = undefined,
  maxLength = undefined,
  disabledStatus = undefined,
  inputValue,
  onChangeFunction,
}: TextInputPropsType) {
  return (
    <>
      <label htmlFor={name}>Nazwa</label>
      <input
        type="text"
        name={name}
        id={name}
        required={isRequired}
        minLength={minLength}
        maxLength={maxLength}
        disabled={disabledStatus}
        value={inputValue}
        onChange={onChangeFunction}
      />
    </>
  );
}
