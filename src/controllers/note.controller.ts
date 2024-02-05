import express from "express";
import Note from "../models/note.model";
import User from "../models/user.model";

// @desc Get all notes
// @route GET /notes
// @access Private
const getAllNotes = async (req: express.Request, res: express.Response) => {
  try {
    // Get all notes from MongoDB
    const notes = await Note.find().lean();
    // If no notes
    if (!notes.length) {
      return res.status(400).json({ message: "No notes found" });
    }
    // Add username to each note before sending the response
    const notesWithUser = await Promise.all(
      notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec();
        return { ...note, username: user?.username };
      })
    );
    res.json(notesWithUser);
  } catch (err) {
    return res.status(500).json({ message: "Unable to retrieve notes" });
  }
};

// @desc Create new note
// @route POST /notes
// @access Private
const createNewNote = async (req: express.Request, res: express.Response) => {
  try {
    const { user, title, text } = req.body;
    // Confirm data
    if (!user || !title || !text) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Check for duplicate title
    const duplicate = await Note.findOne({ title }).lean().exec();
    if (duplicate) {
      return res.status(409).json({ message: "Duplicate note title" });
    }
    const note = new Note({
      user,
      title,
      text,
    });
    await note.save();
    return res.status(201).json({ message: "New note created" });
  } catch (err) {
    return res.status(400).json({ message: "Invalid note data received" });
  }
};

// @desc Update a note
// @route PATCH /notes
// @access Private
const updateNote = async (req: express.Request, res: express.Response) => {
  try {
    const { id, user, title, text, completed } = req.body;
    // Confirm data
    if (!id || !user || !title || !text || typeof completed !== "boolean") {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Confirm note exists to update
    const note = await Note.findById(id).exec();
    if (!note) {
      return res.status(400).json({ message: "Note not found" });
    }
    // Check for duplicate title
    const duplicate = await Note.findOne({ title }).lean().exec();
    // Allow renaming of the original note
    if (duplicate && duplicate?._id.toString() !== id) {
      return res.status(409).json({ message: "Duplicate note title" });
    }
    note.user = user;
    note.title = title;
    note.text = text;
    note.completed = completed;
    const updatedNote = await note.save();
    res.json(`'${updatedNote.title}' updated`);
  } catch (err) {
    return res.status(500).json({ message: "Unable to update note" });
  }
};

// @desc Delete a note
// @route DELETE /notes
// @access Private
const deleteNote = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.body;
    // Confirm data
    if (!id) {
      return res.status(400).json({ message: "Note ID required" });
    }
    // Confirm note exists to delete
    const note = await Note.findById(id).exec();
    if (!note) {
      return res.status(400).json({ message: "Note not found" });
    }
    await Note.findOneAndDelete({ _id: id });
    res.json({ message: `Note '${note.title}' with ID ${note._id} deleted` });
  } catch (err) {
    return res.status(500).json({ message: "Unable to delete note" });
  }
};

export default {
  getAllNotes,
  createNewNote,
  updateNote,
  deleteNote,
};
