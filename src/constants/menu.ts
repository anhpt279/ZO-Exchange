import { NavLink } from "@/types"

export const navLinks: NavLink[] = [
  {
    label: "Home",
    route: "/",
    imgURL: "",
  },
  {
    label: "My farm",
    route: "/farm",
    imgURL: "",
  },
  {
    label: "Inventory",
    route: "/inventory",
    imgURL: "",
  },
  {
    label: "Collect NFTs",
    route: "/collect",
    imgURL: "",
  },
  {
    label: "Ranking & history",
    route: "",
    imgURL: "",
    subMenu: [
      {
        label: "Ranking",
        route: "/ranking",
        imgURL: "",
      },
      {
        label: "History",
        route: "/history",
        imgURL: "",
      },
    ],
  },
  {
    label: "More",
    route: "",
    imgURL: "",
    subMenu: [
      {
        label: "FAQ",
        route: "/faq",
        imgURL: "",
      },
      {
        label: "Referral",
        route: "/referral",
        imgURL: "",
      },
      {
        label: "Swap token",
        route: "/swap-token",
        imgURL: "",
      },
    ],
  },
]
