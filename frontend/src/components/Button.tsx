
interface IButton{
    name: string;
    onClick: ()=> void;
    isDialog?: boolean
}

function Button({name, onClick, isDialog}: IButton){
    return (
      <div className="text-[1.2rem]">
        <button 
        className={`bg-[#3BAD9E]  rounded-lg text-white mb-3 ${isDialog? "max-w-[200px] p-1 px-4"  : "w-2xs mt-8 p-2.5"} `} 
        onClick={onClick}>
          <p className={`${isDialog? "text-sm":" "}`} >{name}</p>
        </button>
      </div>
    );
}

export default Button;