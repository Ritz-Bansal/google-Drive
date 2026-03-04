function Error({content}: {content: string}){
    return (
        <div className="text-xs font-semibold text-center text-[#C41616]">
            {content}
        </div>
    )
}

export default Error;