const prisma = require('../utils/prisma.cjs');

// MongoDB ObjectId validation
const isValidObjectId = (id) => {
  return typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
};

// Validation helper functions
const validateSongName = (name) => {
  if (!name || typeof name !== 'string') return 'Song name must be a non-empty string';
  if (name.trim().length === 0) return 'Song name cannot be empty or whitespace';
  if (name.length > 255) return 'Song name too long (max 255 characters)';
  return null;
};

const validatePlaylistId = (id) => {
  if (!id) return 'Playlist ID is required';
  if (typeof id !== 'string') return 'Playlist ID must be a string';
  if (!isValidObjectId(id)) return 'Playlist ID must be a valid MongoDB ObjectID (24-character hex string)';
  return null;
};

const validateSongId = (id) => {
  if (!id) return 'Song ID is required';
  if (typeof id !== 'string') return 'Song ID must be a string';
  if (!isValidObjectId(id)) return 'Song ID must be a valid MongoDB ObjectID (24-character hex string)';
  return null;
};

const validateSearchQuery = (query) => {
  if (!query) return 'Search query is required';
  if (typeof query !== 'string') return 'Search query must be a string';
  if (query.trim().length < 2) return 'Search query must be at least 2 characters';
  if (query.length > 100) return 'Search query too long (max 100 characters)';
  return null;
};

const songController = {
  addSongToPlaylist: async (req, res) => {
    try {
      const { songName, playlistId } = req.body;
      console.log(req);

      // Validate input
      const songNameError = validateSongName(songName);
      const playlistIdError = validatePlaylistId(playlistId);
      
      if (songNameError || playlistIdError) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: {
            ...(songNameError && { songName: songNameError }),
            ...(playlistIdError && { playlistId: playlistIdError })
          },
          received: { songName, playlistId }
        });
      }

      const cleanedSongName = songName.trim();

      // Find song
      const song = await prisma.song.findFirst({
        where: { 
          name: { 
            equals: cleanedSongName,
            mode: 'insensitive'
          } 
        },
        include: { artist: true }
      });
  
      if (!song) {
        return res.status(404).json({ 
          message: 'Song not found',
          suggestion: 'Please check the song name or add the song to your library first'
        });
      }
  
      // Check for duplicates
      const existingMapping = await prisma.songPlaylistMap.findFirst({
        where: {
          AND: [
            { songId: song.id },
            { playlistId: playlistId }
          ]
        },
        select: { id: true }
      });
  
      if (existingMapping) {
        return res.status(409).json({ 
          message: 'Song already exists in this playlist',
          existingSongId: song.id
        });
      }
  
      // Add to playlist
      await prisma.songPlaylistMap.create({
        data: {
          song: { connect: { id: song.id } },
          playlist: { connect: { id: playlistId } }
        }
      });
  
      // Update song count
      await prisma.playlist.update({
        where: { id: playlistId },
        data: { songCount: { increment: 1 } }
      });
  
      res.status(201).json({ 
        message: 'Song added to playlist successfully',
        addedSong: {
          id: song.id,
          name: song.name,
          artist: song.artist?.name
        }
      });
  
    } catch (error) {
      console.error("Error in addSongToPlaylist:", error);
      res.status(500).json({ 
        message: 'Error adding song to playlist',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  removeSongFromPlaylist: async (req, res) => {
    try {
      const { songId, playlistId } = req.body;
      
      // Validate input
      const songIdError = validateSongId(songId);
      const playlistIdError = validatePlaylistId(playlistId);
      
      if (songIdError || playlistIdError) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: {
            ...(songIdError && { songId: songIdError }),
            ...(playlistIdError && { playlistId: playlistIdError })
          }
        });
      }

      // Check mapping exists
      const mapping = await prisma.songPlaylistMap.findFirst({
        where: { 
          songId: songId, 
          playlistId: playlistId 
        }
      });

      if (!mapping) {
        return res.status(404).json({ 
          message: 'Song not found in playlist' 
        });
      }

      // Remove from playlist
      await prisma.songPlaylistMap.deleteMany({ 
        where: { 
          songId: songId, 
          playlistId: playlistId 
        } 
      });

      // Update song count
      await prisma.playlist.update({
        where: { id: playlistId },
        data: { songCount: { decrement: 1 } }
      });

      res.json({ 
        message: 'Song removed from playlist successfully',
        removedSongId: songId
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Error removing song from playlist',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  searchSong: async (req, res) => {
    try {
      const { query } = req.query;
      
      // Validate input
      const queryError = validateSearchQuery(query);
      if (queryError) {
        return res.status(400).json({
          message: 'Invalid search query',
          error: queryError
        });
      }

      const cleanedQuery = query.trim();
      const songs = await prisma.song.findMany({
        where: { 
          OR: [
            { name: { contains: cleanedQuery, mode: 'insensitive' } },
            { artist: { name: { contains: cleanedQuery, mode: 'insensitive' } } }
          ]
        },
        include: {
          artist: { select: { name: true } }
        },
        take: 20,
        orderBy: { name: 'asc' }
      });

      res.json({
        count: songs.length,
        results: songs
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Error searching for songs',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  getSongByName: async (req, res) => {
    try {
      const { name } = req.params;
      
      // Validate input
      const nameError = validateSongName(name);
      if (nameError) {
        return res.status(400).json({
          message: 'Invalid song name',
          error: nameError
        });
      }

      const cleanedName = name.trim();
      const song = await prisma.song.findFirst({
        where: {
          name: {
            equals: cleanedName,
            mode: 'insensitive'
          }
        },
        include: { artist: true }
      });

      if (!song) {
        return res.status(404).json({
          message: 'Song not found',
          suggestion: 'Check spelling or try a different name'
        });
      }

      res.json(song);
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching song',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

module.exports = songController;