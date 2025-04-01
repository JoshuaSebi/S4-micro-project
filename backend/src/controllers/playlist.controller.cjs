const prisma = require('../utils/prisma.cjs');

const createPlaylist = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const { name, songCount = 0 } = req.body;
    const playlist = await prisma.playlist.create({
      data: { name, userId: req.user.id, songCount },
    });
    res.json({ message: "Playlist created", playlist });
  } catch (error) {
    res.status(500).json({ message: "Error creating playlist", error: error.message });
  }
};

const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.playlist.delete({ where: { id } });
    res.json({ message: 'Playlist deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting playlist', error: error.message });
  }
};

const getUserPlaylists = async (req, res) => {
  try {
    const playlists = await prisma.playlist.findMany({ 
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { songs: true } // This adds songCount
        }
      }
    });
    
    // Format the response to include songCount
    const formattedPlaylists = playlists.map(playlist => ({
      id: playlist.id,
      name: playlist.name,
      songCount: playlist._count.songs,
      addedAt: playlist.addedAt
    }));
    console.log("formatted",formattedPlaylists)
    res.status(200).json({formattedPlaylists});
  } catch (error) {
    res.status(500).json({ message: 'Error fetching playlists', error: error.message });
  }
};

const getPlaylistDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const playlist = await prisma.playlist.findUnique({
      where: { id },
    });
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching playlist', error: error.message });
  }
};

const getPlaylistSongs = async (req, res) => {
  try {
    const { id } = req.params;
    const songMappings = await prisma.songPlaylistMap.findMany({
      where: { playlistId: id },
      include: { 
        song: {
          include: {
            artist: true
          }
        } 
      },
      orderBy: { addedAt: 'asc' }
    });

    const songs = songMappings.map(item => ({
      id: item.song.id,
      name: item.song.name,
      artist: item.song.artist ? {
        id: item.song.artist.id,
        name: item.song.artist.name
      } : undefined,
      duration: item.song.duration
    }));

    res.status(200).json({"songs":songs});
  } catch (error) {
    res.status(500).json({ message: 'Error fetching songs', error: error.message });
  }
};

const updatePlaylistSongCount = async (req, res) => {
  try {
    const { id } = req.params;
    const songCount = await prisma.songPlaylistMap.count({
      where: { playlistId: id }
    });

    const updatedPlaylist = await prisma.playlist.update({
      where: { id },
      data: { songCount }
    });

    res.json(updatedPlaylist);
  } catch (error) {
    res.status(500).json({ message: 'Error updating song count', error: error.message });
  }
};
const getAPlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    
    const playlist = await prisma.playlist.findFirst({
      where: { id: id }, // No need to parse as int if it's a string
    });

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    res.status(200).json({ playlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



module.exports = { 
  createPlaylist, 
  deletePlaylist, 
  getUserPlaylists,
  getPlaylistDetails,
  getPlaylistSongs,
  updatePlaylistSongCount,
  getAPlaylist,
};