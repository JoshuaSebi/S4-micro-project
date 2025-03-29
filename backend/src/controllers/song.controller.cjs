const prisma = require('../utils/prisma.cjs');

// Add a song to a playlist
const addSongToPlaylist = async (req, res) => {
  try {
    const { songId, playlistId } = req.body;
    await prisma.songPlaylistMap.create({ data: { songId: Number(songId), playlistId: Number(playlistId) } });
    res.json({ message: 'Song added to playlist' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding song to playlist', error: error.message });
  }
};

// Remove a song from a playlist
const removeSongFromPlaylist = async (req, res) => {
  try {
    const { songId, playlistId } = req.body;
    await prisma.songPlaylistMap.deleteMany({ where: { songId: Number(songId), playlistId: Number(playlistId) } });
    res.json({ message: 'Song removed from playlist' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing song from playlist', error: error.message });
  }
};

// Search for a song by name
const searchSong = async (req, res) => {
  try {
    const { query } = req.query;
    const songs = await prisma.song.findMany({
      where: { name: { contains: query, mode: 'insensitive' } },
    });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: 'Error searching for songs', error: error.message });
  }
};

module.exports = { addSongToPlaylist, removeSongFromPlaylist, searchSong };
