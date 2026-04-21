import { prisma } from "../config/db.js";

// @desc    Get all movies
// @route   GET /movies
// @access  Public
const getAllMovies = async (req, res) => {
  try {
    const movies = await prisma.movie.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({
      status: "success",
      results: movies.length,
      data: { movies },
    });
  } catch (error) {
    console.error(`Error fetching movies: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Get single movie
// @route   GET /movies/:id
// @access  Public
const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await prisma.movie.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        watchlistItems: true,
      },
    });

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json({
      status: "success",
      data: { movie },
    });
  } catch (error) {
    console.error(`Error fetching movie: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Create a new movie
// @route   POST /movies
// @access  Private (requires authentication)
const createMovie = async (req, res) => {
  try {
    const { title, overview, releaseYear, genres, runtime, posterUrl } = req.body;
    const userId = req.user.id; // From auth middleware

    // Check if movie with same title and release year exists
    const existingMovie = await prisma.movie.findFirst({
      where: {
        title: title,
        releaseYear: releaseYear,
      },
    });

    if (existingMovie) {
      return res.status(400).json({ 
        message: "Movie with this title and release year already exists" 
      });
    }

    const movie = await prisma.movie.create({
      data: {
        title,
        overview,
        releaseYear,
        genres: genres || [],
        runtime,
        posterUrl,
        createdBy: userId,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      status: "success",
      message: "Movie created successfully",
      data: { movie },
    });
  } catch (error) {
    console.error(`Error creating movie: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Update a movie
// @route   PUT /movies/:id
// @access  Private (only the creator can update)
const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, overview, releaseYear, genres, runtime, posterUrl } = req.body;
    const userId = req.user.id;

    // Check if movie exists
    const movie = await prisma.movie.findUnique({
      where: { id },
    });

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Check if user is the creator
    if (movie.createdBy !== userId) {
      return res.status(403).json({ 
        message: "Not authorized to update this movie" 
      });
    }

    // Update movie
    const updatedMovie = await prisma.movie.update({
      where: { id },
      data: {
        title: title || movie.title,
        overview: overview !== undefined ? overview : movie.overview,
        releaseYear: releaseYear || movie.releaseYear,
        genres: genres || movie.genres,
        runtime: runtime !== undefined ? runtime : movie.runtime,
        posterUrl: posterUrl !== undefined ? posterUrl : movie.posterUrl,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({
      status: "success",
      message: "Movie updated successfully",
      data: { movie: updatedMovie },
    });
  } catch (error) {
    console.error(`Error updating movie: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Delete a movie
// @route   DELETE /movies/:id
// @access  Private (only the creator can delete)
const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if movie exists
    const movie = await prisma.movie.findUnique({
      where: { id },
    });

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Check if user is the creator
    if (movie.createdBy !== userId) {
      return res.status(403).json({ 
        message: "Not authorized to delete this movie" 
      });
    }

    // Delete the movie (watchlistItems will cascade delete due to schema)
    await prisma.movie.delete({
      where: { id },
    });

    res.status(200).json({
      status: "success",
      message: "Movie deleted successfully",
    });
  } catch (error) {
    console.error(`Error deleting movie: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { getAllMovies, getMovieById, createMovie, updateMovie, deleteMovie };