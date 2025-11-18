"use client";

import { OrganizationSwitcher, UserButton, useUser } from "@clerk/nextjs";
import {
  CreditCardIcon,
  InboxIcon,
  LayoutDashboardIcon,
  LibraryBigIcon,
  Mic,
  PaletteIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@workspace/ui/components/sidebar";
import { cn } from "@workspace/ui/lib/utils";

const customerSupportItems = [
  {
    title: "Conversation",
    href: "/conversations",
    icon: <InboxIcon size={16} />,
  },
  {
    title: "Knowledge Base",
    href: "/knowledge-base",
    icon: <LibraryBigIcon size={16} />,
  },
];

const configurationItems = [
  {
    title: "Customization",
    href: "/customization",
    icon: <PaletteIcon size={16} />,
  },
  {
    title: "Integrations",
    href: "/integrations",
    icon: <LayoutDashboardIcon size={16} />,
  },
  {
    title: "Voice Assistant",
    href: "/plugins/vapi",
    icon: <Mic size={16} />,
  },
];

const accountItems = [
  {
    title: "Billing",
    href: "/billing",
    icon: <CreditCardIcon size={16} />,
  },
];

export const DashboardSidebar = () => {
  const pathname = usePathname();

  const isActive = (url: string) => {
    if (url === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(url);
  };

  const { user } = useUser();

  return (
    <Sidebar className="group" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <OrganizationSwitcher
                hidePersonal
                skipInvitationScreen
                appearance={{
                  elements: {
                    organizationSwitcherTrigger: `group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:justify-center`,
                    organizationSwitcherAvatarBox: `group-data-[collapsible=icon]:size-6`,
                    organizationSwitcherText: `group-data-[collapsible=icon]:hidden`,
                  },
                }}
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Customer Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {customerSupportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isActive(item.href)}
                  >
                    <Link href={item.href} className="flex items-center gap-2">
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Configuration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {configurationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isActive(item.href)}
                  >
                    <Link href={item.href} className="flex items-center gap-2">
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isActive(item.href)}
                  >
                    <Link href={item.href} className="flex items-center gap-2">
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenuItem>
          <div className="flex items-center gap-2 transition-all group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
            <UserButton
              appearance={{
                elements: {
                  userButtonOuter: `group-data-[collapsible=icon]:size-6`,
                  userButtonPopoverCard: "min-w-[220px]",
                },
              }}
            />
            <span className="text-sm font-medium group-data-[collapsible=icon]:hidden">
              {user?.fullName}
            </span>
          </div>
        </SidebarMenuItem>
      </SidebarFooter>

      {/* WAJIB ADA */}
      <SidebarRail />
    </Sidebar>
  );
};
