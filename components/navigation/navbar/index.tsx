import Image from "next/image";
import Link from "next/link";

import { auth } from "@/auth";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getUnreadMessageCount } from "@/lib/actions/message.action";

import Theme from "./Theme";

const Navbar = async () => {
  const session = await auth();
  const userId = session?.user.id || "";

  const { data } = await getUnreadMessageCount({ userId });

  const unreadCount = data?.unreadCount || 0;

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
          href="/messages"
          className="bg-background dark:bg-input/30 relative flex h-9 w-9 items-center justify-center rounded-full border max-lg:hidden"
        >
          <Image
            src="/images/message.png"
            alt="Message"
            width={20}
            height={20}
            className="object-contain dark:invert-100"
          />
          {unreadCount > 0 && (
            <span className="text-foreground absolute -top-1 -right-1 size-4 rounded-full bg-blue-500 text-center text-[10px]">
              {unreadCount}
            </span>
          )}
        </Link>
        <Link
          href="/announcements"
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
        <Link
          className="flex items-center gap-4 max-md:hidden"
          href={"/profile"}
        >
          <div className="flex flex-col max-lg:hidden">
            <span className="text-sm leading-3 font-medium">
              {session?.user.name}
            </span>
            <span className="text-right text-[10px] text-gray-500">
              {session?.user.role}
            </span>
          </div>
          <Image
            src={session?.user.image || "/images/avatar.png"}
            alt={session?.user.name || "User Avatar"}
            width={36}
            height={36}
            className="rounded-full max-md:hidden"
          />
        </Link>
        <SidebarTrigger variant={"outline"} className="size-9 md:hidden" />
      </div>
    </nav>
  );
};

export default Navbar;
