const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Kanban = require("../models/Kanban");

// Get all kanban boards for user
router.get("/boards", auth, async (req, res) => {
  try {
    const boards = await Kanban.find({
      $or: [
        { createdBy: req.user.id },
        { teamMembers: req.user.id },
        { isPublic: true },
      ],
    })
      .populate("createdBy", "name")
      .populate("teamMembers", "name email")
      .sort({ createdAt: -1 });

    res.json(boards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new kanban board
router.post("/boards", auth, async (req, res) => {
  try {
    const { title, description, type, teamMembers, isPublic } = req.body;

    const board = new Kanban({
      title,
      description,
      type,
      createdBy: req.user.id,
      teamMembers: teamMembers || [],
      isPublic: isPublic || false,
      columns: [
        { title: "To Do", position: 0, tasks: [] },
        { title: "In Progress", position: 1, tasks: [] },
        { title: "Review", position: 2, tasks: [] },
        { title: "Done", position: 3, tasks: [] },
      ],
    });

    await board.save();
    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add task to kanban board
router.post("/boards/:boardId/tasks", auth, async (req, res) => {
  try {
    const {
      columnId,
      title,
      description,
      priority,
      assignedTo,
      dueDate,
      labels,
    } = req.body;

    const board = await Kanban.findById(req.params.boardId);
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    // Check access
    if (
      board.createdBy.toString() !== req.user.id &&
      !board.teamMembers.includes(req.user.id) &&
      !board.isPublic
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    const column = board.columns.id(columnId);
    if (!column) {
      return res.status(404).json({ error: "Column not found" });
    }

    const newTask = {
      title,
      description,
      priority: priority || "medium",
      assignedTo: assignedTo || [],
      dueDate,
      labels: labels || [],
      position: column.tasks.length,
    };

    column.tasks.push(newTask);
    await board.save();

    // Real-time update
    req.app.get("io").emit("kanban_updated", board);

    res.json(board);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Move task between columns
router.put("/boards/:boardId/tasks/:taskId/move", auth, async (req, res) => {
  try {
    const { fromColumnId, toColumnId, newPosition } = req.body;

    const board = await Kanban.findById(req.params.boardId);
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    // Find and remove task from source column
    const fromColumn = board.columns.id(fromColumnId);
    const taskIndex = fromColumn.tasks.findIndex(
      (t) => t._id.toString() === req.params.taskId
    );

    if (taskIndex === -1) {
      return res.status(404).json({ error: "Task not found" });
    }

    const [task] = fromColumn.tasks.splice(taskIndex, 1);

    // Add task to destination column at specified position
    const toColumn = board.columns.id(toColumnId);
    toColumn.tasks.splice(newPosition, 0, task);

    // Update positions
    toColumn.tasks.forEach((task, index) => {
      task.position = index;
    });

    await board.save();

    // Real-time update
    req.app.get("io").emit("kanban_updated", board);

    res.json(board);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
