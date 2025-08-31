"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { sidebarLinks } from "@/constants";

const LeftSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const pathname = usePathname();
  const data = sidebarLinks;

  return (
    <Sidebar className="w-60" {...props}>
      <SidebarHeader>
        <Link
          href="/"
          className="mt-4 flex items-center gap-2 justify-self-center md:hidden"
        >
          <Image
            src="/images/logo1.png"
            alt="School Logo"
            width={40}
            height={40}
            quality={100}
          />

          <span className="font-bold">SilverOak Academy</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="mb-12 flex flex-col justify-between md:mt-16">
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="pl-4 font-bold">
              {item.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.label} className="pl-4">
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.includes(item.href)}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 font-medium"
                      >
                        <Image
                          src={item.icon}
                          alt={item.label}
                          width={20}
                          height={20}
                        />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};
export default LeftSidebar;
