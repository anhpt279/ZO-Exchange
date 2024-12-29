import { Mulish, Paytone_One as PaytoneOne } from "next/font/google"

export const paytoneOneFont = PaytoneOne({
  weight: "400",
  subsets: ["latin", "vietnamese"],
  variable: "--font-paytone-one",
})

export const mulishFont = Mulish({
  weight: "variable",
  style: ["normal", "italic"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-mulish",
})
