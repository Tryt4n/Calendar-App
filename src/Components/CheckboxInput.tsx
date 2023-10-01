import { ChangeEvent } from "react";

type CheckboxInputPropsType = {
  name: string;
  checkedStatus?: boolean;
  disabledStatus?: boolean;
  onChangeFunction: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function CheckboxInput({
  name,
  checkedStatus,
  disabledStatus = undefined,
  onChangeFunction,
}: CheckboxInputPropsType) {
  return (
    <div className="form-group checkbox">
      <input
        type="checkbox"
        name={name}
        id={name}
        checked={checkedStatus}
        disabled={disabledStatus}
        onChange={onChangeFunction}
      />
      <label htmlFor={name}>{`${name === "all-day" ? "Cały Dzień?" : "Każdego Roku?"}`}</label>
    </div>
  );
}
