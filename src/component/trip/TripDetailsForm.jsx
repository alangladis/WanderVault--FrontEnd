import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  TextField,
  Paper,
  CircularProgress,
  Button,
} from "@mui/material";
import axios from "axios"; // Import axios for API requests

const TripDetails = () => {
  const [showModal, setShowModal] = useState(false);
  const [trips, setTrips] = useState([]); // Store trips
  const [trip, setTrip] = useState({
    name: "",
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    notes: "",
  });
  const [selected, setSelected] = useState([]); // Selected rows
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const [page, setPage] = useState(0); // Pagination page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page
  const [loading, setLoading] = useState(false); // Loading state

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

  useEffect(() => {
    fetchTrips(); // Fetch trips when the component mounts
  }, []);

  // Handle change in form fields
  const handleChange = (e) => {
    const selectedDate = event.target.value;
    if (disabledDates.includes(selectedDate)) {
      alert("This date is unavailable");
      return; // Don't update the date if it's disabled
    }
    setTrip({ ...trip, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields and startDate < endDate
    if (
      !trip.name ||
      !trip.destination ||
      !trip.startDate ||
      !trip.endDate ||
      !trip.budget
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (new Date(trip.startDate) >= new Date(trip.endDate)) {
      alert("Start Date must be before End Date.");
      return;
    }

    // Ensure budget is an array of objects
    const budget = trip.budget
      ? [{ category: "General", amount: trip.budget }]
      : [{ category: "General", amount: 0 }];

    // Construct the trip data object
    const newTrip = {
      name: trip.name,
      destination: trip.destination,
      startDate: trip.startDate,
      endDate: trip.endDate,
      budget: trip.budget, // Ensure this is an array of objects
      notes: trip.notes,
    };

    setLoading(true);

    try {
      // Send the new trip data to the backend
      const response = await axios.post(
        "http://localhost:3031/api/createTrip",
        newTrip
      );

      // Update the state with the new trip
      setTrips([...trips, response.data]);

      // Reset the form
      setTrip({
        name: "",
        destination: "",
        startDate: "",
        endDate: "",
        budget: "",
        notes: "",
      });

      // Close the modal
      setShowModal(false);
    } catch (error) {
      console.error("Error adding trip:", error);
      alert("Error adding trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle row selection
  const handleSelectRow = (event, tripName) => {
    const selectedIndex = selected.indexOf(tripName);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, tripName);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  // Handle select all rows
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = trips.map((trip) => trip.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  // Filter trips based on search query
  const filteredTrips = trips.filter(
    (trip) =>
      trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.startDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.endDate.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle page change for pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const disabledDates = ["2025-01-25", "2025-02-01"];
  return (
    <div className="container rounded-5 h-100 mt-2 bg-light p-3">
      <h3 className="text-center p-4 my-3">Trip Details</h3>

      {/* Add Trip Button */}
      <div className="d-flex align-items-end justify-content-end pe-4">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowModal(true)}
          sx={{ mb: 3 }}
        >
          Add Trip
        </Button>
      </div>
      <div className="d-flex align-items-end justify-content-end px-4">
        {/* Search Bar */}
        <TextField
          label="Search Trips"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 3 }}
        />
      </div>
      <div className="d-grid align-items-center  px-4">
        {/* MUI Table */}
        {loading ? (
          <CircularProgress />
        ) : (
          <TableContainer component={Paper}>
            <Table aria-labelledby="tableTitle" size="medium">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      indeterminate={
                        selected.length > 0 &&
                        selected.length < filteredTrips.length
                      }
                      checked={
                        filteredTrips.length > 0 &&
                        selected.length === filteredTrips.length
                      }
                      onChange={handleSelectAllClick}
                      inputProps={{ "aria-label": "select all trips" }}
                    />
                  </TableCell>
                  <TableCell>Trip Name</TableCell>
                  <TableCell>Destination</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Budget (₹)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTrips
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((trip) => {
                    const isSelected = selected.indexOf(trip.name) !== -1;
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={-1}
                        key={trip.name}
                        selected={isSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isSelected}
                            onChange={(event) =>
                              handleSelectRow(event, trip.name)
                            }
                            inputProps={{ "aria-labelledby": trip.name }}
                          />
                        </TableCell>
                        <TableCell>{trip.name}</TableCell>
                        <TableCell>{trip.destination}</TableCell>
                        <TableCell>{trip.startDate}</TableCell>
                        <TableCell>{trip.endDate}</TableCell>
                        <TableCell>
                          {trip.budget ? trip.budget : "N/A"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredTrips.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>

      {/* Modal for Trip Form */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content bg-light text-dark">
              <div className="modal-header justify-content-between">
                <h5 className="modal-title">Add New Trip</h5>
                <Button
                  variant="text"
                  onClick={() => setShowModal(false)}
                  sx={{ fontSize: "1.5rem" }}
                >
                  &times;
                </Button>
              </div>

              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Trip Name</label>
                    <TextField
                      type="text"
                      name="name"
                      className="form-control"
                      value={trip.name}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Destination</label>
                    <TextField
                      type="text"
                      name="destination"
                      className="form-control"
                      value={trip.destination}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Start Date</label>
                      <TextField
                        type="date"
                        name="startDate"
                        className="form-control"
                        value={trip.startDate}
                        onChange={handleChange}
                        fullWidth
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">End Date</label>
                      <TextField
                        type="date"
                        name="endDate"
                        className="form-control"
                        value={trip.endDate}
                        onChange={handleChange}
                        fullWidth
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Budget (₹)</label>
                    <TextField
                      type="number"
                      name="budget"
                      className="form-control"
                      value={trip.budget}
                      onChange={handleChange}
                      placeholder="Eg: 50000"
                      fullWidth
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Notes</label>
                    <textarea
                      name="notes"
                      className="form-control"
                      value={trip.notes}
                      onChange={handleChange}
                    />
                  </div>

                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                  >
                    Save Trip
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Background Overlay */}
      {showModal && (
        <div
          className="modal-backdrop fade show"
          onClick={() => setShowModal(false)}
        ></div>
      )}
    </div>
  );
};

export default TripDetails;
