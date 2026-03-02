import SearchBar from "./SearchBar";
import logo from "../assets/logo.png"

function TopBar(){
    return (
        <div className="flex">
            <div className="basis-1/7">
                <img src={logo} alt="" />
            </div>
            <div className="basis-3/7">
                <SearchBar />
            </div>
        </div>
    )
}

export default TopBar;