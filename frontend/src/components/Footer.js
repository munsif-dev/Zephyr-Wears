import { copyrightSign } from "../assets/icons";
//import { footerLogo } from "../assets/images";
import { footerLinks, socialMedia } from "../constants";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className=" bg-[#8cc6fce9] pt-6 pl-10 pr-12 pb-3 w-full">
      <div className="flex justify-between items-start gap-20 flex-wrap max-lg:flex-col mx-2">
        <div className="flex flex-col items-start">
          <a href="/">
            <Logo w={150} h={80} />
          </a>
          <p className="mt-6 text-base leading-7 font-montserrat text-white-400 sm:max-w-sm">
            Get shoes ready for the new term at your nearest Nike store. Find
            Your perfect Size In Store. Get Rewards
          </p>
          <div className="flex items-center gap-5 mt-8">
            {socialMedia.map((icon) => (
              <div
                className="flex justify-center items-center w-12 h-12 bg-white rounded-full"
                key={icon.alt}
              >
                <img src={icon.src} alt={icon.alt} width={24} height={24} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-1 justify-between lg:gap-10 gap-20 flex-wrap pt-5 pl-15">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-montserrat text-2xl leading-normal font-medium mb-5 text-slate-800">
                {section.title}
              </h4>
              <ul>
                {section.links.map((link) => (
                  <li
                    className="mt-3 mb-0 font-montserrat text-base leading-normal text-white-400 hover:text-slate-gray"
                    key={link.name}
                  >
                    <a href={link.link}>{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between text-slate-400 mt-12 mx-2 max-sm:flex-col max-sm:items-center">
        <div className="flex flex-1 justify-start items-center gap-2 font-montserrat cursor-pointer text-slate-400">
          <img
            src={copyrightSign}
            alt="copyright sign"
            width={20}
            height={20}
            className="rounded-full m-0 text-slate-600"
          />
          <p>Copyright. All rights reserved.</p>
        </div>
        <p className="font-montserrat cursor-pointer">Terms & Conditions</p>
      </div>
    </footer>
  );
};

export default Footer;
