"use client"
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit"

const ConnectButton = () => {
  return (
    <RainbowConnectButton
      accountStatus={{
        smallScreen: "avatar",
        largeScreen: "full",
      }}
      showBalance={false}
    />
  )
}
export default ConnectButton
