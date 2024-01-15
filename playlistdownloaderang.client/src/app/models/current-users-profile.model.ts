export interface CurrentUsersProfile {
  country: string,
  display_name: string,
  email: string,
  explicit_content: {
    filter_enabled: boolean,
    filter_locked: boolean
  },
  external_urls: {
    spotify: string
  },
  followers: {
    href: string|null,
    total: number
  },
  href: string,
  id: string,
  images: 
    {
      url: string,
      height: number|null,
      width: number|null
    }[],
  product: string,
  type: string,
  uri: string
}

//export interface Explicit_Content {
//  filter_enabled: boolean,
//  filter_locked: boolean
//}

//export interface External_urls {
//  spotify: string
//}

//export interface Followers {
//  href: string,
//  total: number
//}

//export interface Image {
//  url: string,
//  height: number,
//  width: number
//}
