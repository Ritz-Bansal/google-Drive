interface IFooter{
    content: string;
    link: string;
    navigateTo: ()=> void;
}

function Footer({content, link, navigateTo}: IFooter){
    return (
      <div className="text-center mt-15">
        <p className="text-[#8C8989]">
          {content}
          <a onClick={navigateTo} className="text-[#3BAD9E]">
            {link}
          </a>
        </p>
      </div>
    );
}

export default Footer;