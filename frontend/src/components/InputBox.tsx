import type { SetStateAction } from "react";

interface IInputBox {
    placeholder: string;
    header: string;
    setterFunction: React.Dispatch<SetStateAction<string>>;
    focus?: boolean;
}

function InputBox({placeholder, header, setterFunction, focus}: IInputBox){
    return (
      <div className="text-[1.2rem]">
        <h2 className="text-[#3BAD9E] pl-5 pb-0.5">{header}</h2>
        <input
          autoFocus={focus}
          className={`border-[#3BAD9E] border-1 rounded-lg p-2.5 w-2xs text-left mb-4`}
          type="text"
        //   placeholder={placeholder}
          onChange={(e) => setterFunction(e.target.value)}
        />
      </div>
    );
}

export default InputBox;