function UploadForm(){
    return (
        <div>
        <input type="file" className="border-2" placeholder="upload here" onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}/>
        <input type="text"  placeholder="File title" onChange={(e) => setTitle(e.target.value)}/>
        <input type="text" placeholder="File type" onChange={(e) => setType(e.target.value)}/>
        <button>Upload</button>
        </div>
    )
}

export default UploadForm;