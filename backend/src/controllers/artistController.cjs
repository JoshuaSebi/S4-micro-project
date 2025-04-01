 const { PrismaClient } = require('@prisma/client');
 const prisma = new PrismaClient();

// const getAllArtists = async (req, res) => {
//   try {
//     const artists = await prisma.artist.findMany({
//       include: {
//         songs: true,
//       },
//     });
//     res.json(artists);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch artists' });
//   }
// };

 

const getAllArtists = async (req, res) => {
  try {
    const artists = await prisma.artist.findMany({
      include: {
        songs: true,
      },
    });
    res.json(artists);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch artists' });
  }
};
module.exports = { getAllArtists };