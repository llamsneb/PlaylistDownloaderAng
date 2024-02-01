using static System.Runtime.InteropServices.JavaScript.JSType;

namespace PlaylistDownloaderAng.Server
{
    public class Playlist
    {
        public bool Collaborative;
        public string? Description;
        public External_urls External_urls;
        public Followers Followers;
        public string? Href;
        public string Id;
        public List<Images> Images;
        public string Name;
        public Owner Owner;        
        public bool Public;
        public string Snapshot_id;
        public Tracks Tracks;
        public string Type;
        public string uri;
    }

    public class External_urls
    {
        string Spotify;
    };

    public class Followers
    {
        string Href;
        int Total;
    };

    public class Images
    {
        string Url;
        int? Height;
        int? Width;
    };

    public class Owner
    {
        public External_urls External_urls;
        public Followers Followers;
        public string Href;
        public string Id;
        public string Type;
        public string Uri;
        public string? Display_name;
    };

    public class Tracks
    {
        public string Href;
        public int Limit;
        public string? Next;
        public int Offset;
        public string? Previous;
        public int Total;
        public List <Items> Items;
    };

    public class Items
    {
        public string Added_at;
        public Added_by Added_By;
        public bool Is_local;
        public Track Track;        
    };

    public class Added_by
    {
        public External_urls External_urls;
        public Followers Followers;
        public string Href;
        public string Id;
        public string Type;
        public string Uri;
    };

    public class Track
    {
        public Album Album;
        public List<Artists> Artists;
        public string[] Available_markets;
        public int Disc_number;
        public int Duration_ms;
        public bool Explicit;
        public External_ids External_ids;
        public External_urls External_urls;
        public string Href;
        public string Id;
        public bool Is_playable;
        public class Linked_from { };
        public Restrictions Restrictions;
        public string Name;
        public int Popularity;
        public string? Preview_url;
        public int Track_number;
        public string Type;
        public string Uri;
        public bool Is_local;
    };

    public class Album
    {
        public string Album_type;
        public int Total_tracks;
        public string[] Available_markets;
        public External_urls External_urls;
        public string Href;
        public string Id;
        public List<Images> Images;
        public string Name;
        public string Release_date;
        public string Release_date_precision;
        public Restrictions Restrictions;        
        public string Type;
        public string Uri;
        public List<Artists> Artists;        
    };
    public class Restrictions
    {
        public string Reason;
    };    

    public class Artists
    {
        public External_urls External_urls;
        public Followers Followers;
        public string[] Genres;
        public string Href;
        public string Id;
        public List<Images> Images;
        public string Name;
        public int Popularity;
        public string Type;
        public string Uri;
    };

    public class External_ids
    {
        public string Isrc;
        public string Ean;
        public string Upc;
    };
}
