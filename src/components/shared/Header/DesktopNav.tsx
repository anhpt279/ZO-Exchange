"use client"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { navLinks } from "@/constants/menu"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

const DesktopNav = () => {
  const pathName = usePathname()
  return (
    <div className="flex h-full items-center justify-center gap-2 max-lg:hidden lg:flex">
      {navLinks.map((navLink, index) => {
        // Direct link
        if (navLink.route) {
          return (
            <Link
              href={navLink.route}
              key={index}
              data-active={pathName === navLink.route}
              className="data-[active=true]:bg-menu-item flex h-full items-center gap-1 border-b-4 border-b-transparent px-4 text-white hover:border-b-white data-[active=true]:border-b-white"
            >
              {navLink.label}
            </Link>
          )
        }
        return (
          <HoverCard key={index} openDelay={300}>
            <HoverCardTrigger className="data-[state=open]:bg-menu-item flex h-full cursor-pointer items-center gap-1 border-b-4 border-b-transparent px-4 text-white hover:border-b-white data-[state=open]:border-b-white">
              <span>{navLink.label}</span>
              <Image
                src={"/assets/icons/chevron-down.svg"}
                width={24}
                height={24}
                alt=""
              />
            </HoverCardTrigger>
            <HoverCardContent className="flex flex-col border-none rounded-none text-white p-0 w-[180px]">
              {navLink.subMenu?.map((subMenu, index) => {
                return (
                  <Link
                    href={subMenu.route}
                    key={index}
                    className="px-4 gap-1 flex items-center bg-[#212944] h-14 hover:bg-opacity-90"
                  >
                    <Image
                      src={"/assets/icons/dot.svg"}
                      width={24}
                      height={24}
                      alt=""
                    />
                    <span>{subMenu.label}</span>
                  </Link>
                )
              })}
            </HoverCardContent>
          </HoverCard>
        )
      })}
    </div>
  )
}

export default DesktopNav
