"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

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
import { Role } from "@/prisma/client";

import { Button } from "../ui/button";

interface LeftSidebarProps extends React.ComponentProps<typeof Sidebar> {
  role: Role;
}

const LeftSidebar = ({ role, ...props }: LeftSidebarProps) => {
  const pathname = usePathname();

  const isActivePath = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

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
          />

          <span className="font-bold">SilverOak Academy</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="mb-12 flex flex-col justify-between md:mt-16">
        <SidebarGroup>
          <SidebarGroupLabel className="pl-4 font-bold">
            {sidebarLinks.title}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarLinks.items
                .filter((item) => item.visible.includes(role))
                .map((item) => (
                  <SidebarMenuItem key={item.label} className="pl-4">
                    <SidebarMenuButton
                      asChild
                      isActive={isActivePath(item.href)}
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
                          className="dark:invert-100"
                        />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="pl-4 font-bold">USER</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="pl-4">
                <SidebarMenuButton asChild isActive={isActivePath("/profile")}>
                  <Link
                    href={"/profile"}
                    className="flex items-center gap-3 font-medium"
                  >
                    <Image
                      src="/images/profile.png"
                      alt="Profile"
                      width={20}
                      height={20}
                      className="dark:invert-100"
                    />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem className="pl-4">
                <SidebarMenuButton asChild isActive={isActivePath("/settings")}>
                  <Link
                    href={"/settings"}
                    className="flex items-center gap-3 font-medium"
                  >
                    <Image
                      src="/images/setting.png"
                      alt="Settings"
                      width={20}
                      height={20}
                      className="dark:invert-100"
                    />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem className="pl-4">
                <SidebarMenuButton asChild>
                  <Button
                    onClick={handleLogout}
                    variant={"ghost"}
                    className="flex cursor-pointer items-center justify-start gap-3 font-medium"
                  >
                    <Image
                      src="/images/logout.png"
                      alt="Logout"
                      width={20}
                      height={20}
                      className="dark:invert-100"
                    />
                    <span>Logout</span>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};
export default LeftSidebar;
