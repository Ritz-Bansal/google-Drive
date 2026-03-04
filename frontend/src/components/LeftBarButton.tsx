
interface ILeftBarButton {
    content: string;
    onCLickHandler: ()=> void;
}

function LeftBarButton({content, onCLickHandler}: ILeftBarButton){
    return (
        <div>
            <button
            className="rounded-4xl bg-white font-medium text-sm text-[#3BAD9E] py-2 w-full min-w-41 max-w-41" 
            onClick={onCLickHandler}>{content}</button>
        </div>
    )
}

export default LeftBarButton;