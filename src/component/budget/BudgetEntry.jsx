import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  IconButton,
} from "@mui/material";
import { AddCircle, Visibility } from "@mui/icons-material";
const BudgetEntry = () => {
  const [trips, setTrips] = useState([]); // Add trips state
  const [loading, setLoading] = useState(false); // Add loading state
  const [openModal, setOpenModal] = useState(false);
  const [openExpenseModal, setOpenExpenseModal] = useState(false); // Modal for displaying expenses
  const [expenseDetails, setExpenseDetails] = useState({
    amount: "",
    tripId: "",
    currency: "USD",
    merchant: "",
    location: "",
    paidBy: "",
    paymentMode: "Cash",
    dateOfExpense: "",
    paymentStatus: "Pending",
    notes: "",
    expenseSplit: "",
    expenseType: "",
  });

  const [currentExpenses, setCurrentExpenses] = useState([]); // State to store current expenses for a trip

  // Handle opening the expense modal
  const handleExpenseModalOpen = (tripId) => {
    fetchExpenses(tripId); // Fetch expenses for the specific trip
    setOpenExpenseModal(true);
  };
  const handleClickOpen = () => setOpenModal(true);
  const handleClose = () => {
    setOpenModal(false);
    setOpenExpenseModal(false); // Close the expenses modal as well
  };

  const handleChange = (field, value) => {
    setExpenseDetails((prevDetails) => ({ ...prevDetails, [field]: value }));
  };

  // Fetch trips from API
  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3031/api/getTrips"); // Adjust to your API endpoint
      setTrips(response.data); // Set trips data from API
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch expenses for a specific trip
  const fetchExpenses = async (tripId) => {
    try {
      const response = await axios.get(
        `http://localhost:3031/api/expenses/getExpense/${tripId}` // Add a slash between the endpoint and tripId
      );
      setCurrentExpenses(response.data.expenses); // Set expenses data for the trip
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    fetchTrips(); // Fetch trips when the component mounts
  }, []);

  const handleSubmit = async () => {
    try {
      // Make the POST request to your backend API
      const response = await axios.post(
        "http://localhost:3031/api/expenses/addExpense",
        expenseDetails
      );

      // Handle the response
      if (response.status === 201) {
        // Successfully added the expense
        console.log("Expense Added:", response.data);
        // You can show a success message here if desired
        alert("Expense added successfully!");
      } else {
        // Handle unsuccessful attempt
        console.error("Error adding expense:", response.data);
        alert("Failed to add expense.");
      }
    } catch (error) {
      console.error("Error in submitting expense:", error);
      alert("An error occurred while adding the expense.");
    }

    // Close the modal after submitting the expense
    setOpenModal(false);
  };

  return (
    <div className="container h-100 p-4">
      <div className="row bg-light h-100 p-4 rounded-5">
        {loading ? (
          <p>Loading trips...</p> // Display loading message while fetching trips
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Trip Name</TableCell>
                  <TableCell>Destination</TableCell>
                  <TableCell>Add Expense</TableCell>
                  <TableCell>View</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trips.map((trip) => (
                  <TableRow key={trip._id}>
                    <TableCell>{trip.name}</TableCell>
                    <TableCell>{trip.destination}</TableCell>
                    <TableCell>
                      <Tooltip title="Add Expense">
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setExpenseDetails({
                              ...expenseDetails,
                              tripId: trip._id,
                            });
                            handleClickOpen();
                          }}
                        >
                          <AddCircle />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Show Expenses">
                        <IconButton
                          color="secondary"
                          onClick={() => handleExpenseModalOpen(trip._id)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog open={openModal} onClose={handleClose}>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogContent>
            <TextField
              label="Amount"
              fullWidth
              type="number"
              value={expenseDetails.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              margin="dense"
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Currency</InputLabel>
              <Select
                value={expenseDetails.currency}
                onChange={(e) => handleChange("currency", e.target.value)}
              >
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
                <MenuItem value="INR">INR</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Merchant / Vendor"
              fullWidth
              value={expenseDetails.merchant}
              onChange={(e) => handleChange("merchant", e.target.value)}
              margin="dense"
            />
            <TextField
              label="Location"
              fullWidth
              value={expenseDetails.location}
              onChange={(e) => handleChange("location", e.target.value)}
              margin="dense"
            />
            <TextField
              label="Paid By"
              fullWidth
              value={expenseDetails.paidBy}
              onChange={(e) => handleChange("paidBy", e.target.value)}
              margin="dense"
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Payment Mode</InputLabel>
              <Select
                value={expenseDetails.paymentMode}
                onChange={(e) => handleChange("paymentMode", e.target.value)}
              >
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Credit Card">Credit Card</MenuItem>
                <MenuItem value="Debit Card">Debit Card</MenuItem>
                <MenuItem value="Online">Online</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Date of Expense"
              fullWidth
              type="date"
              value={expenseDetails.dateOfExpense}
              onChange={(e) => handleChange("dateOfExpense", e.target.value)}
              margin="dense"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Payment Status</InputLabel>
              <Select
                value={expenseDetails.paymentStatus}
                onChange={(e) => handleChange("paymentStatus", e.target.value)}
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Expense Notes"
              fullWidth
              value={expenseDetails.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              margin="dense"
              multiline
              rows={4}
            />
            <TextField
              label="Expense Split"
              fullWidth
              value={expenseDetails.expenseSplit}
              onChange={(e) => handleChange("expenseSplit", e.target.value)}
              margin="dense"
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Expense Type</InputLabel>
              <Select
                value={expenseDetails.expenseType}
                onChange={(e) => handleChange("expenseType", e.target.value)}
              >
                <MenuItem value="Travel">Travel</MenuItem>
                <MenuItem value="Food">Food</MenuItem>
                <MenuItem value="Accommodation">Accommodation</MenuItem>
                <MenuItem value="Shopping">Shopping</MenuItem>
                <MenuItem value="Miscellaneous">Miscellaneous</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              Add Expense
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openExpenseModal} onClose={handleClose}>
          <DialogTitle>Expenses</DialogTitle>
          <DialogContent>
            {currentExpenses.length === 0 ? (
              <p>No expenses added for this trip yet.</p>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Amount</TableCell>
                      <TableCell>Currency</TableCell>
                      <TableCell>Merchant</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Payment Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentExpenses.map((expense) => (
                      <TableRow key={expense._id}>
                        <TableCell>{expense.amount}</TableCell>
                        <TableCell>{expense.currency}</TableCell>
                        <TableCell>{expense.merchant}</TableCell>
                        <TableCell>{expense.location}</TableCell>
                        <TableCell>{expense.paymentStatus}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default BudgetEntry;
