"use client"
import headerLogo from "@images/header-logo.svg"
import Image from "next/image"
import Link from "next/link"
import ConnectButton from "./ConnectButton"
import DesktopNav from "./DesktopNav"

const Header = () => {
  return (
    <div
      style={{ backgroundColor: "rgba(31, 67, 125, 0.40)" }}
      className="flex h-[80px] w-full items-center justify-center gap-6 px-[160px]"
    >
      {/* Logo */}
      <Link href="/">
        <Image src={headerLogo} width={70} height={24} alt="Logo" />
      </Link>

      {/* Menu */}
      <DesktopNav />

      {/* Connect button */}
      <ConnectButton />
    </div>
  )
}

export default Header
