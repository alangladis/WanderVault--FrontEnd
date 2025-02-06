import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Modal,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PdfGenerator from "../utils/PdfGenerator";

const ToDoList = () => {
  const [task, setTask] = useState(""); // Current task input
  const [tasks, setTasks] = useState([]); // To-Do tasks for current trip
  const [openModal, setOpenModal] = useState(false); // Modal visibility
  const [currentRow, setCurrentRow] = useState(null); // Current trip data
  const [trips, setTrips] = useState([]); // Trips data
  const [loading, setLoading] = useState(false); // Loading state for trips
  console.log("currentRow", currentRow);
  console.log("tasks", tasks);
  // Fetch trips data from the API
  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3031/api/getTrips"); // Adjust with correct endpoint
      setTrips(response.data); // Set trips data
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch To-Do List for a specific trip (and combine all tasks)
  const fetchToDoList = async (tripId) => {
    try {
      const response = await axios.get(
        `http://localhost:3031/api/todolist/getToDoList/${tripId}`
      );
      // Combine all tasks from the multiple entries and flatten them into a single array
      const allTasks = response.data.reduce((acc, entry) => {
        return acc.concat(entry.tasks); // Merge tasks from all to-do list entries
      }, []);

      // Remove duplicate tasks based on _id (or task text if needed)
      const uniqueTasks = allTasks.filter(
        (task, index, self) =>
          index === self.findIndex((t) => t._id === task._id) // Remove duplicates by _id
      );

      setTasks(uniqueTasks); // Set the unique list of tasks
    } catch (error) {
      console.error("Error fetching to-do list:", error);
    }
  };

  // Create a new task for the trip
  const addTask = async () => {
    if (task.trim() === "") return;

    try {
      const response = await axios.post(
        "http://localhost:3031/api/todolist/createToDoList",
        {
          tripId: currentRow._id,
          tasks: { text: task, completed: false },
        }
      );

      setTasks(response.data.tasks); // Update the tasks after adding a new task
      setTask(""); // Reset task input
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const toggleTaskCompletion = async (taskIndex) => {
    const updatedTasks = tasks.map((task, idx) =>
      idx === taskIndex ? { ...task, completed: !task.completed } : task
    );

    try {
      const taskId = tasks[taskIndex]._id; // Ensure this exists in your task object
      if (!taskId) {
        console.error("Task ID is missing for task at index", taskIndex);
        return;
      }

      const response = await axios.put(
        `http://localhost:3031/api/todolist/updateTask/${currentRow._id}/${taskId}`, // Pass both tripId and taskId
        {
          completed: updatedTasks[taskIndex].completed, // Send updated completion status
        }
      );

      // Handle the response to ensure the task was updated
      if (response.status === 200) {
        console.log("Task updated successfully:", response.data);
      }

      setTasks(updatedTasks); // Update tasks with the new completion status
    } catch (error) {
      console.error("Error toggling task completion:", error.response || error);
    }
  };

  // Delete a task
  const deleteTask = async (taskIndex) => {
    // Get the task to be deleted using the index
    const taskToDelete = tasks[taskIndex];
    const tripId = currentRow._id; // Get the tripId
    const taskId = taskToDelete._id; // Get the taskId

    // Create a new array with the task removed
    const updatedTasks = tasks.filter((_, idx) => idx !== taskIndex);

    try {
      // Make sure both tripId and taskId are being passed correctly
      await axios.delete(
        `http://localhost:3031/api/todolist/deleteTask/${tripId}/${taskId}`, // Pass both tripId and taskId
        {
          data: { taskIndex }, // You can still send taskIndex if needed in the request body
        }
      );

      setTasks(updatedTasks); // Update tasks after deletion
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Open modal and fetch the to-do list for a selected trip
  const openTaskModal = (row) => {
    setCurrentRow(row);
    fetchToDoList(row._id); // Fetch tasks for the selected trip
    setOpenModal(true);
  };

  // Close modal
  const closeModal = () => {
    setOpenModal(false);
    setTasks([]); // Clear tasks on modal close
  };

  useEffect(() => {
    fetchTrips(); // Fetch trips when the component mounts
  }, []);

  return (
    <div className="h-100">
      <div className="todo-list-container h-100 bg-light p-3 rounded-5">
        <h3 className="text-center m-4">To-Do List</h3>
        <PdfGenerator/>
        <div className="p-4 w-100">
          {/* Table to display trips */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Destination</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trips.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.destination}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => openTaskModal(row)}>
                        <AddIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        {/* Modal to add tasks for the selected trip */}
        <Modal open={openModal} onClose={closeModal}>
          <div
            className="modal-container"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "400px",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <h4>To-Do List for {currentRow?.name}</h4>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Enter a task"
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
              <button
                className="btn btn-primary"
                onClick={addTask}
                disabled={!task.trim()}
              >
                Add Task
              </button>
            </div>
            <ul className="list-group">
              {tasks.map((task, index) => (
                <li
                  key={index}
                  className={`list-group-item d-flex justify-content-between align-items-center ${
                    task.completed ? "list-group-item-success" : ""
                  }`}
                >
                  <span
                    style={{
                      textDecoration: task.completed ? "line-through" : "none",
                      color: task.completed ? "#6c757d" : "initial",
                    }}
                  >
                    {task.text}
                  </span>
                  <div>
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={() => toggleTaskCompletion(index)}
                    >
                      {task.completed ? "Undo" : "Complete"}
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteTask(index)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <Button
              onClick={closeModal}
              variant="contained"
              color="secondary"
              fullWidth
              style={{ marginTop: "20px" }}
            >
              Close
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ToDoList;
