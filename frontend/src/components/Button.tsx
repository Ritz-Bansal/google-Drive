import { ButtonSpinner } from "./ButtonSpinner";

interface IButton {
  name: string;
  onClick?: () => void;
  isDialog?: boolean;
  isDisable?: boolean;
}

function Button({name, onClick, isDialog, isDisable}: IButton){
    return (
      <div className="text-[1.2rem]">
        <button
        disabled = {isDisable ? true: false}
        type="submit"
        className={`bg-[#3BAD9E]  w-full rounded-lg text-white mb-3 ${isDisable ? "p-2": ""} ${isDialog? "min-w-[100px] px-4 p-1"  : "w-2xs mt-8 p-2.5"} `} 
        onClick={onClick}>
          {isDisable? <ButtonSpinner isDialog={isDialog} /> :<p className={`${isDialog? "text-sm":" "}`} >{name}</p>}
        </button>
      </div>
    );
}

export default Button;