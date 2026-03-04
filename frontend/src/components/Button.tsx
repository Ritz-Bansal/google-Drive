
interface IButton{
    name: string;
    onClick: ()=> void;
}

function Button({name, onClick}: IButton){
    return (
      <div className="text-[1.2rem]">
        <button 
        className="bg-[#3BAD9E] p-2.5 rounded-lg w-2xs text-white mt-8 mb-3" 
        onClick={onClick}>
          {name}
        </button>
      </div>
    );
}

export default Button;