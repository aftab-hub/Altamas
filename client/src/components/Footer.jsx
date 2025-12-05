import { assets, footerLinks } from "../assets/assets";

const Footer = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-24 bg-primary/2 border border-t-gray-300">

      {/* TOP SECTION */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500">

        {/* Logo + Description */}
        <div className="w-full md:w-[40%]">
          <img
            className="w-32 h-12 sm:w-36 md:w-40 object-cover"
            src={assets.logo}
            alt="logo"
          />
          <p className="max-w-[420px] mt-6 text-sm md:text-base leading-relaxed">
            We deliver fresh groceries and snacks straight to your door. Trusted by thousands, we aim to make your shopping experience simple and affordable.
          </p>
        </div>

        {/* Footer Link Sections */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full md:w-[85%]">
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-gray-800 mb-2 md:mb-4 text-sm md:text-base">
                {section.title}
              </h3>
              <ul className="text-sm space-y-1">
                {section.links.map((link, i) => (
                  <li key={i} className="w-full">
                    <a href={link.url} className="hover:underline transition">
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>

      {/* COPYRIGHT */}
      <p className="py-4 text-center text-sm md:text-base text-gray-500/80">
        © {new Date().getFullYear()} Not-Expensive — All Rights Reserved.
      </p>

    </div>
  );
};

export default Footer;
