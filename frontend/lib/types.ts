export interface Artist {
  id: string
  name: string
  genre: string
  bio: string
  image?: string
  info?: string
  moreInfoLink?: string
}

export interface Song {
  id: string
  title: string
  artist: string
  artistId: string
  album: string
  duration: string
  genre: string
  releaseDate: string
  cover?: string
  lyrics?: string
}

export interface Playlist {
  id?:string
  name: string
  songCount: number
  cover?: string
}

