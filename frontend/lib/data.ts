import type { Artist, Song } from "./types"

export const artists: Artist[] = [
  {
    id: "1",
    name: "Taylor Swift",
    genre: "Pop",
    bio: "Taylor Alison Swift is an American singer-songwriter. Her discography spans multiple genres, and her songwriting—often inspired by her personal life—has received critical praise and wide media coverage.",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "2",
    name: "The Weeknd",
    genre: "R&B/Pop",
    bio: "Abel Makkonen Tesfaye, known professionally as the Weeknd, is a Canadian singer, songwriter, and record producer. He is known for his sonic versatility and dark lyricism.",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "3",
    name: "Billie Eilish",
    genre: "Pop/Alternative",
    bio: "Billie Eilish Pirate Baird O'Connell is an American singer and songwriter. She first gained public attention in 2015 with her debut single 'Ocean Eyes'.",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "4",
    name: "Drake",
    genre: "Hip-Hop/Rap",
    bio: "Aubrey Drake Graham is a Canadian rapper, singer, and actor. An influential figure in modern popular music, Drake has been credited for popularizing singing and R&B sensibilities in hip hop.",
    image: "/placeholder.svg?height=300&width=300",
  },
]

export const songs: Song[] = [
  {
    id: "1",
    title: "Blank Space",
    artist: "Taylor Swift",
    artistId: "1",
    album: "1989",
    duration: "3:51",
    genre: "Pop",
    releaseDate: "2014",
    cover: "/placeholder.svg?height=300&width=300",
    lyrics:
      "Nice to meet you, where you been?\nI could show you incredible things\nMagic, madness, heaven, sin\nSaw you there and I thought\nOh my God, look at that face\nYou look like my next mistake\nLove's a game, wanna play?",
  },
  {
    id: "2",
    title: "Blinding Lights",
    artist: "The Weeknd",
    artistId: "2",
    album: "After Hours",
    duration: "3:20",
    genre: "Synth-pop",
    releaseDate: "2019",
    cover: "/placeholder.svg?height=300&width=300",
    lyrics:
      "I've been tryna call\nI've been on my own for long enough\nMaybe you can show me how to love, maybe\nI'm going through withdrawals\nYou don't even have to do too much\nYou can turn me on with just a touch, baby",
  },
  {
    id: "3",
    title: "Bad Guy",
    artist: "Billie Eilish",
    artistId: "3",
    album: "When We All Fall Asleep, Where Do We Go?",
    duration: "3:14",
    genre: "Electropop",
    releaseDate: "2019",
    cover: "/placeholder.svg?height=300&width=300",
    lyrics:
      "White shirt now red, my bloody nose\nSleeping, you're on your tippy toes\nCreeping around like no one knows\nThink you're so criminal\nBruises on both my knees for you\nDon't say thank you or please\nI do what I want when I'm wanting to\nMy soul? So cynical",
  },
  {
    id: "4",
    title: "God's Plan",
    artist: "Drake",
    artistId: "4",
    album: "Scorpion",
    duration: "3:18",
    genre: "Hip-Hop/Rap",
    releaseDate: "2018",
    cover: "/placeholder.svg?height=300&width=300",
    lyrics:
      "And they wishin' and wishin' and wishin' and wishin'\nThey wishin' on me, yeah\nI been movin' calm, don't start no trouble with me\nTryna keep it peaceful is a struggle for me\nDon't pull up at 6 AM to cuddle with me\nYou know how I like it when you lovin' on me",
  },
  {
    id: "5",
    title: "Anti-Hero",
    artist: "Taylor Swift",
    artistId: "1",
    album: "Midnights",
    duration: "3:20",
    genre: "Pop",
    releaseDate: "2022",
    cover: "/placeholder.svg?height=300&width=300",
    lyrics:
      "I have this thing where I get older, but just never wiser\nMidnights become my afternoons\nWhen my depression works the graveyard shift, all of the people\nI've ghosted stand there in the room",
  },
  {
    id: "6",
    title: "Save Your Tears",
    artist: "The Weeknd",
    artistId: "2",
    album: "After Hours",
    duration: "3:35",
    genre: "Synth-pop",
    releaseDate: "2020",
    cover: "/placeholder.svg?height=300&width=300",
    lyrics:
      "I saw you dancing in a crowded room\nYou look so happy when I'm not with you\nBut then you saw me, caught you by surprise\nA single teardrop falling from your eye",
  },
]

export function getSongsByArtist(artistId: string): Song[] {
  return songs.filter((song) => song.artistId === artistId)
}

export function getArtistById(artistId: string): Artist | undefined {
  return artists.find((artist) => artist.id === artistId)
}

