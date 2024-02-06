import express from "express";
import noteController from "../controllers/note.controller";

const router = express.Router();

router
  .route("/")
  .get(noteController.getAllNotes)
  .post(noteController.createNewNote)
  .patch(noteController.updateNote)
  .delete(noteController.deleteNote);

export default router;
