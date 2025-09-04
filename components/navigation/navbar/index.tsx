import Image from "next/image";
import Link from "next/link";

import { SidebarTrigger } from "@/components/ui/sidebar";

import Theme from "./Theme";

const Navbar = () => {
  return (
    <nav className="bg-sidebar fixed z-50 flex w-full items-center justify-between gap-5 border-b p-3 md:px-6">
      <Link
        href="/"
        className="flex items-center gap-2 justify-self-center lg:justify-start"
      >
        <Image
          src="/images/logo1.png"
          alt="School Logo"
          width={40}
          height={40}
        />

        <span className="hidden font-bold lg:block">SilverOak Academy</span>
      </Link>

      <div className="">
        <p>Global Search</p>
      </div>

      <div className="flex items-center justify-end gap-4 md:gap-6">
        <Link
          href="/"
          className="bg-background dark:bg-input/30 flex h-9 w-9 items-center justify-center rounded-full border max-lg:hidden"
        >
          <Image
            src="/images/message.png"
            alt="Message"
            width={20}
            height={20}
            className="object-contain dark:invert-100"
          />
        </Link>
        <Link
          href="/"
          className="bg-background dark:bg-input/30 flex h-9 w-9 items-center justify-center rounded-full border max-lg:hidden"
        >
          <Image
            src="/images/announcement.png"
            alt="Announcement"
            width={20}
            height={20}
            className="object-contain dark:invert-100"
          />
        </Link>
        <Theme />
        <div className="flex flex-col max-lg:hidden">
          <span className="text-sm leading-3 font-medium">John Doe</span>
          <span className="text-right text-[10px] text-gray-500">Admin</span>
        </div>
        <Image
          src="/images/avatar.png"
          alt="User"
          width={36}
          height={36}
          className="rounded-full max-md:hidden"
        />
        <SidebarTrigger className="bg-background size-9 border md:hidden" />
      </div>
    </nav>
  );
};

export default Navbar;
