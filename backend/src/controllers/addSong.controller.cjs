const prisma = require('../utils/prisma.cjs');

const addMusicData = async (req, res) => {
  try {
    // Sample data - same as before
    const artists = [
      {
        name: "Vineeth Sreenivasan",
        info: "Indian playback singer and actor from Kerala",
        moreInfoLink: "https://en.wikipedia.org/wiki/Vineeth_Sreenivasan"
      },
      {
        name: "Ed Sheeran",
        info: "English singer-songwriter",
        moreInfoLink: "https://en.wikipedia.org/wiki/Ed_Sheeran"
      },
      {
        name: "The Weeknd",
        info: "Canadian singer and record producer",
        moreInfoLink: "https://en.wikipedia.org/wiki/The_Weeknd"
      },
      {
        name: "Maroon 5",
        info: "American pop rock band",
        moreInfoLink: "https://en.wikipedia.org/wiki/Maroon_5"
      },
      {
        name: "Linkin Park",
        info: "American rock band",
        moreInfoLink: "https://en.wikipedia.org/wiki/Linkin_Park"
      }
    ];
    const songs = [
      // Vineeth Sreenivasan
      {
        name: "Kaatu Mooliyo",
        artistName: "Vineeth Sreenivasan",
        songLink: "https://www.youtube.com/watch?v=5JhZfU9g2k8", // Actual link
        duration: 3.45
      },
      {
        name: "Madhu Pakaru",
        artistName: "Vineeth Sreenivasan",
        songLink: "https://www.youtube.com/watch?v=0x3Ql7H0Wxw", // Actual link
        duration: 4.10
      },
      
      // Ed Sheeran
      {
        name: "Shape of You",
        artistName: "Ed Sheeran",
        songLink: "https://www.youtube.com/watch?v=JGwWNGJdvx8",
        duration: 3.53
      },
      {
        name: "Perfect",
        artistName: "Ed Sheeran",
        songLink: "https://www.youtube.com/watch?v=2Vv-BfVoq4g",
        duration: 4.23
      },
      // The Weeknd
      {
        name: "Blinding Lights",
        artistName: "The Weeknd",
        songLink: "https://www.youtube.com/watch?v=4NRXx6U8ABQ",
        duration: 3.20
      },
      {
        name: "Starboy",
        artistName: "The Weeknd",
        songLink: "https://www.youtube.com/watch?v=34Na4j8AVgA",
        duration: 3.50
      },
      
      // Maroon 5
      {
        name: "Sugar",
        artistName: "Maroon 5",
        songLink: "https://www.youtube.com/watch?v=09R8_2nJtjg",
        duration: 3.55
      },
      {
        name: "Memories",
        artistName: "Maroon 5",
        songLink: "https://www.youtube.com/watch?v=SlPhMPnQ58k",
        duration: 3.09
      },
      
      // Linkin Park
      {
        name: "Numb",
        artistName: "Linkin Park",
        songLink: "https://www.youtube.com/watch?v=kXYiU_JCYtU",
        duration: 3.07
      },
      {
        name: "In the End",
        artistName: "Linkin Park",
        songLink: "https://www.youtube.com/watch?v=eVTXPUF4Oz4",
        duration: 3.36
      }
    ];

    // 1. First create all artists
    const createdArtists = await Promise.all(
      artists.map(artist => 
        prisma.artist.create({
          data: artist,
        })
      )
    );

    // 2. Then create songs with artist mapping
    const artistNameToId = createdArtists.reduce((map, artist) => {
      map[artist.name] = artist.id;
      return map;
    }, {});

    // For MongoDB, we need to handle duplicates manually
    const songCreationResults = await Promise.all(
      songs.map(song => 
        prisma.song.create({
          data: {
            name: song.name,
            songLink: song.songLink,
            duration: song.duration,
            artistId: artistNameToId[song.artistName]
          }
        }).catch(e => {
          if (e.code === 'P2002') { // Unique constraint violation
            console.log(`Song "${song.name}" already exists`);
            return null;
          }
          throw e;
        })
      )
    );

    const successfulCreations = songCreationResults.filter(result => result !== null);

    res.status(201).json({
      success: true,
      artists: createdArtists,
      songsCreated: successfulCreations.length,
      details: successfulCreations
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      hint: "Check if artists exist and song names are unique"
    });
  }
};

module.exports = { addMusicData };