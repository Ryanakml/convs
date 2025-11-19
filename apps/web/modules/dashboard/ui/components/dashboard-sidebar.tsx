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
    <Sidebar
      className="group bg-sidebar text-sidebar-foreground border-r border-sidebar-border"
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-sidebar-border py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="hover:bg-sidebar-accent"
            >
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
          <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs font-semibold uppercase tracking-wider px-3 mb-2">
            Customer Support
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {customerSupportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isActive(item.href)}
                    className={cn(
                      "rounded-lg transition-all duration-200",
                      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      "data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground",
                      "data-[active=true]:shadow-sm"
                    )}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2"
                    >
                      <span className="flex items-center justify-center">
                        {item.icon}
                      </span>
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs font-semibold uppercase tracking-wider px-3 mb-2">
            Configuration
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {configurationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isActive(item.href)}
                    className={cn(
                      "rounded-lg transition-all duration-200",
                      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      "data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground",
                      "data-[active=true]:shadow-sm"
                    )}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2"
                    >
                      <span className="flex items-center justify-center">
                        {item.icon}
                      </span>
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs font-semibold uppercase tracking-wider px-3 mb-2">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isActive(item.href)}
                    className={cn(
                      "rounded-lg transition-all duration-200",
                      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      "data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground",
                      "data-[active=true]:shadow-sm"
                    )}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2"
                    >
                      <span className="flex items-center justify-center">
                        {item.icon}
                      </span>
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <SidebarMenuItem>
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-200 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
            <UserButton
              appearance={{
                elements: {
                  userButtonOuter: `group-data-[collapsible=icon]:size-6`,
                  userButtonPopoverCard: "min-w-[220px]",
                },
              }}
            />
            <span className="text-sm font-medium text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              {user?.fullName}
            </span>
          </div>
        </SidebarMenuItem>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};
