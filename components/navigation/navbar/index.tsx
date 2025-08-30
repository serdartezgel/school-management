import Image from "next/image";
import Link from "next/link";

import Theme from "./Theme";

const Navbar = () => {
  return (
    <nav className="bg-accent fixed z-50 flex w-full justify-between gap-5 p-6 sm:px-12">
      <Link href="/" className="flex items-center gap-1">
        {/* <Image
          src="/images/site-logo.svg"
          width={23}
          height={23}
          alt="School Logo"
        /> */}

        <p className="max-sm:hidden">School</p>
      </Link>

      <p>Global Search</p>

      <div className="flex justify-between gap-5">
        <Theme />
      </div>
    </nav>
  );
};

export default Navbar;
