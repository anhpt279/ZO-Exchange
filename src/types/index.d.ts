export interface NavLink {
  imgURL?: string
  route?: string
  label: string
  subMenu?: {
    imgURL?: string
    route: string
    label: string
  }[]
}
