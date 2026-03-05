import type { SetStateAction } from "react";

interface IInputBox {
    placeholder?: string;
    header?: string;
    setterFunction: React.Dispatch<SetStateAction<string>>;
    focus?: boolean;
}

function InputBox({placeholder, header, setterFunction, focus}: IInputBox){
    return (
      <div className="text-[1.2rem]">
        {header ? <h2 className="text-[#3BAD9E] pl-5 pb-0.5">{header}</h2> : null}
        <input
          autoFocus={focus}
          className={
            `w-full border-[#3BAD9E] border-1 focus:outline-none focus:ring-[#3BAD9E] rounded-lg p-2.5 w-2xs text-left mb-4
            ${placeholder ? "placeholder:text-[#6c6969] pl-5":""}  
            `}
          type="text"
          placeholder={placeholder ? placeholder: undefined}
          onChange={(e) => setterFunction(e.target.value)}
        />
      </div>
    );
}

export default InputBox;