"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import {Ticket01Icon, User03Icon, Package01Icon, LayoutBottomIcon, AudioWave01Icon, CommandIcon, ComputerTerminalIcon, RoboticIcon, BookOpen02Icon, Settings05Icon, CropIcon, PieChartIcon, MapsIcon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Link } from "react-router"
import { useSelector } from "react-redux"
import useAuth from "@/hooks/useAuth"

type Role = "admin" | "customer";

type NavItem = {
  title: string;
  url: string;
  isActive?: boolean;
  icon: React.ReactNode;
  roles?: Role[]; // omit = visible to everyone
  items?: { title: string; url: string; roles?: Role[] }[];
};


///Place to set sidebar content (navigation)

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const {name, role, email} = useAuth()

  const navMain: NavItem[] = [
    {
      title: "Order",
      url: "/dashboard/order",
      isActive: true,
      icon: <HugeiconsIcon icon={Ticket01Icon} strokeWidth={2} />,
      items: [
        { title: "Track Order", url: "/dashboard/order" },
      ],
    },
    {
      title: "Package",
      url: "/dashboard/package",
      roles: ["admin"], // customers won't see this
      icon: <HugeiconsIcon icon={Package01Icon} strokeWidth={2} />,
      items: [
        { title: "Manage Pelamin Package", url: "/dashboard/package" },
      ],
    },
  ];

  const canSee = (roles?: Role[]) =>
    !roles || roles.includes(role as Role);

  const visibleNav = navMain
    .filter((item) => canSee(item.roles))
    .map((item) => ({
      ...item,
      items: item.items?.filter((sub) => canSee(sub.roles)),
    }));

  return (
    <Sidebar collapsible="icon" className="top-(--header-height)! h-[calc(100svh-var(--header-height))]!" {...props} >
      {/*<SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader> */}
      <SidebarContent>
        <div className="p-2 w-full">
            <Link to="/dashboard/book">
          <Button className="@container w-full">
              <span className="@[50px]:hidden">+</span>
              <span className="hidden @[50px]:@[50px]:inline">
                Book Pelamin +
              </span>
          </Button>
            </Link>
        </div>
        <NavMain items={visibleNav} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{name: name, email:email, avatar:"/avatars/shadcn.jpg", role: role}}/>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
