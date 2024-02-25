export interface CurrentUsersPlaylists {
  href: string,
  limit: number,
  next: string|null,
  offset: number,
  previous: string|null,
  total: number,
  items: [
    {
      collaborative: boolean,
      description: string,
      external_urls: {
        spotify: string
      },
      href: string,
      id: string,
      images: [
        {
          url: string,
          height: number,
          width: number
        }
      ],
      name: string,
      owner: {
        external_urls: {
          spotify: string
        },
        followers: {
          href: string,
          total: number
        },
        href: string,
        id: string,
        type: string,
        uri: string,
        display_name: string
      },
      public: boolean,
      snapshot_id: string,
      tracks: {
        href: string,
        total: number
      },
      type: string,
      uri: string
    }
  ]
}