const prisma = require('../utils/prisma.cjs');

const createPlaylist = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const { name, songCount } = req.body;
    const playlist = await prisma.playlist.create({
      data: { name, userId: req.user.id, songCount },
    });
    res.json({ message: "Playlist created", playlist });
  } catch (error) {
    res.status(500).json({ message: "Error creating playlist", error: error.message });
  }
};


// Delete a playlist by ID
const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.playlist.delete({ where: { id: id } });
    res.json({ message: 'Playlist deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting playlist', error: error.message });
  }
};

// Get all playlists for the logged-in user
const getUserPlaylists = async (req, res) => {
  try {
    const playlists = await prisma.playlist.findMany({ where: { userId: req.user.id } });
    res.json({ playlists }); // Ensure response structure matches frontend expectations
  } catch (error) {
    res.status(500).json({ message: 'Error fetching playlists', error: error.message });
  }
};


// Get all songs in a specific playlist
const getPlaylistSongs = async (req, res) => {
  try {
    const { id } = req.params;
    const songs = await prisma.songPlaylistMap.findMany({
      where: { playlistId: id },
      include: { song: true },
    });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching songs', error: error.message });
  }
};

module.exports = { createPlaylist, deletePlaylist, getUserPlaylists, getPlaylistSongs };
