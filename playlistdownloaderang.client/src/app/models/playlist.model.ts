export interface Playlist {
  collaborative: boolean,
  description: string | null,
  external_urls: external_urls,
  followers: followers,
  href: string | null,
  id: string,
  images: images[],
  name: string,
  owner: owner,
  public: boolean,
  snapshot_id: string,
  tracks: tracks,
  type: string,
  uri: string
}

export interface external_urls {
  spotify: string
}

export interface followers {
  href: string,
  total: number
}

export interface images {
  url: string,
  height: number | null,
  width: number | null
}

export interface owner {
  external_urls: external_urls,
  followers: followers,
  href: string,
  id: string,
  type: string,
  uri: string,
  display_name: string | null
}

export interface tracks {
  href: string,
  limit: number,
  next: string | null,
  offset: number,
  previous: string | null,
  total: number,
  items: items
}

export interface added_by {
  external_urls: external_urls,
  followers: followers,
  href: string,
  id: string,
  type: string,
  uri: string
}

export interface items {
  added_at: string,
  added_by: added_by,
  is_local: boolean,
  track: track[]
}

export interface track {
  album: album,
  artists: artists[],
  available_markets: string[],
  disc_number: number,
  duration_ms: number,
  explicit: boolean,
  external_ids: {
    isrc: string,
    ean: string,
    upc: string
  },
  external_urls: external_urls,
  href: string,
  id: string,
  is_playable: boolean,
  linked_from: { },
  restrictions: {
    reason: string
  },
  name: string,
  popularity: number,
  preview_url: string | null,
  track_number: number,
  type: string,
  uri: string,
  is_local: boolean
}

export interface album {
  album_type: string,
  total_tracks: number,
  available_markets: string[],
  external_urls: external_urls,
  href: string,
  id: string,
  images: images[],
  name: string,
  release_date: string,
  release_date_precision: string,
  restrictions: {
    reason: string
  },
  type: string,
  uri: string,
  artists: artists[]
}

export interface artists {
  external_urls: external_urls,
  followers: followers,
  genres: string[],
  href: string,
  id: string,
  images: images[],
  name: string,
  popularity: number,
  type: string,
  uri: string
}

//export interface Playlist {
//  collaborative: boolean,
//  description: string | null,
//  external_urls: {
//    spotify: string
//  },
//  followers: {
//    href: string,
//    total: number
//  },
//  href: string | null,
//  id: string,
//  images:
//  {
//    url: string,
//    height: number | null,
//    width: number | null
//  }[],
//  name: string,
//  owner: {
//    external_urls: {
//      spotify: string
//    },
//    followers: {
//      href: string,
//      total: number
//    },
//    href: string,
//    id: string,
//    type: string,
//    uri: string,
//    display_name: string | null
//  },
//  public: boolean,
//  snapshot_id: string,
//  tracks: tracks,
//  type: string,
//  uri: string
//}
