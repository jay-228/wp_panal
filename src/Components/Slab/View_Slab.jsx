import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactDatetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";

const API_URL = "http://147.93.107.44:5000";

const View_Slab = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    WhaSlabName: "",
    WhaWEF: "",
  });
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // You can adjust this value as needed

  // Utility function to format date and time in 24-hour format
  const formatDateTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`; // 24-hour format
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/slab_view`);
        if (response.data && Array.isArray(response.data.data)) {
          setData(response.data.data);
        } else {
          throw new Error("API response does not contain the expected data");
        }
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle delete click
  const handleDeleteClick = (itemId) => {
    if (!itemId) {
      toast.error("Item ID is missing!");
      return;
    }
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Slab?"
    );
    if (isConfirmed) {
      handleDelete(itemId);
    }
  };

  // Handle delete
  const handleDelete = async (itemId) => {
    try {
      await axios.get(`${API_URL}/slab_delete/${itemId}`);
      setData(data.filter((item) => item._id !== itemId));
      toast.success("Item deleted successfully");
    } catch (err) {
      toast.error("Failed to delete item");
    }
  };

  // Handle update click
  const handleUpdateClick = (item) => {
    setSelectedItem(item);
    setUpdatedData({
      WhaSlabName: item.WhaSlabName,
      WhaWEF: formatDateTime(item.WhaWEF) || formatDateTime(new Date()), // Use formatted date
    });
    setIsModalOpen(true);
  };

  // Handle input change
  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle date change in ReactDatetime
  const handleDateChange = (date) => {
    if (!date) return; // Avoid setting if the date is invalid
    const selectedDate = new Date(date);

    // Check if the selected date is valid
    if (isNaN(selectedDate.getTime())) {
      toast.error("Invalid date selected");
      return;
    }

    const now = new Date();
    // Set the time to the current time in 24-hour format
    selectedDate.setHours(now.getHours());
    selectedDate.setMinutes(now.getMinutes());

    // Set the updated data with correctly formatted date
    setUpdatedData((prev) => ({
      ...prev,
      WhaWEF: formatDateTime(selectedDate), // Ensure the format is correct
    }));
  };

  // Handle update submit
  const handleUpdateSubmit = async () => {
    try {
      await axios.put(
        `${API_URL}/slab_update/${selectedItem._id}`,
        updatedData
      );
      setData(
        data.map((item) =>
          item._id === selectedItem._id ? { ...item, ...updatedData } : item
        )
      );
      setIsModalOpen(false);
      toast.success("Item updated successfully");
    } catch (err) {
      toast.error("Failed to update item");
    }
  };

  // Filter data based on search term
  const filteredData = data.filter((item) =>
    item.WhaSlabName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Get current items for the page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <div
        className="addadmin_header"
        style={{
          height: "80px",
          backgroundColor: "#D6DCEC",
          marginTop: "60px",
        }}
      >
        <div style={{ backgroundColor: "rgba(97, 158, 208, 1)" }}>
          <div className="d-flex justify-content-center py-4">
            <h3
              className="rounded-2 m-0 px-5 text-white uppercase"
              style={{ backgroundColor: "black" }}
            >
              View Slab Detail
            </h3>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center mt-5">
        <button
          className="btn btn-primary"
          onClick={() => setShowActiveOnly(!showActiveOnly)}
          style={{ marginRight: "10px" }}
        >
          {showActiveOnly ? "Slab Data" : "Slab Data"}
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/View_SlabDT")}
        >
          Slab Details
        </button>
      </div>

      {/* Table Section */}
      <div className="container mt-4">
        <div
          className="table-wrapper"
          style={{ maxWidth: "1000px", margin: "0 auto" }}
        >
          <div className="table-responsive">
            {/* Search Bar */}
            <div className="container-fluid my-4">
              <div
                className="d-flex align-items-center mb-3"
                style={{ marginBottom: "0" }}
              >
                <label
                  htmlFor="searchSlabName"
                  className="form-label me-2 mb-0 fw-bold"
                  style={{ marginBottom: "0" }}
                >
                  Search Slab:
                </label>
                <div className="input-group" style={{ width: "250px" }}>
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    id="searchSlabName"
                    placeholder="Search By Slab Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <table className="table table-bordered table-hover">
              <thead className="table-primary text-center">
                <tr>
                  <th>No</th>
                  <th className="text-center">Slab Name</th>
                  <th className="text-center">Date - Time</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <tr key={index} className="align-middle">
                      <td style={{ textAlign: "center" }}>{index + 1}</td>
                      <td
                        className="text-start"
                        style={{ textTransform: "uppercase" }}
                      >
                        {item.WhaSlabName}
                      </td>
                      <td className="text-start">
                        {formatDateTime(item.WhaWEF)}
                      </td>

                      <td className="text-center">
                        <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
                          <button
                            className="btn btn-warning mx-2"
                            onClick={() => handleUpdateClick(item)}
                          >
                            Update
                          </button>
                          <button
                            className="btn btn-danger mx-2"
                            onClick={() => handleDeleteClick(item._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-danger fw-bold">
                      No matching records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="d-flex justify-content-end mt-4">
              <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                    onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                  >
                    <a className="page-link" href="#">
                      Previous
                    </a>
                  </li>

                  {/* Show first page */}
                  {currentPage > 2 && (
                    <li className="page-item" onClick={() => paginate(1)}>
                      <a className="page-link" href="#">
                        1
                      </a>
                    </li>
                  )}

                  {/* Show second page */}
                  {currentPage > 3 && (
                    <li className="page-item" onClick={() => paginate(2)}>
                      <a className="page-link" href="#">
                        2
                      </a>
                    </li>
                  )}

                  {/* Ellipses between pages */}
                  {currentPage > 3 && (
                    <li className="page-item disabled">
                      <a className="page-link" href="#">
                        ...
                      </a>
                    </li>
                  )}

                  {/* Show current page */}
                  <li className="page-item active">
                    <a className="page-link" href="#">
                      {currentPage}
                    </a>
                  </li>

                  {/* Ellipses before last page */}
                  {currentPage <
                    Math.ceil(filteredData.length / itemsPerPage) - 2 && (
                    <li className="page-item disabled">
                      <a className="page-link" href="#">
                        ...
                      </a>
                    </li>
                  )}

                  {/* Show last page */}
                  {currentPage <
                    Math.ceil(filteredData.length / itemsPerPage) - 1 && (
                    <li
                      className="page-item"
                      onClick={() =>
                        paginate(Math.ceil(filteredData.length / itemsPerPage))
                      }
                    >
                      <a className="page-link" href="#">
                        {Math.ceil(filteredData.length / itemsPerPage)}
                      </a>
                    </li>
                  )}

                  <li
                    className={`page-item ${
                      currentPage ===
                      Math.ceil(filteredData.length / itemsPerPage)
                        ? "disabled"
                        : ""
                    }`}
                    onClick={() =>
                      currentPage <
                        Math.ceil(filteredData.length / itemsPerPage) &&
                      paginate(currentPage + 1)
                    }
                  >
                    <a className="page-link" href="#">
                      Next
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Update */}
      {isModalOpen && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ display: "block", paddingRight: "17px" }} // Modal custom styles
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Slab Data </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Slab Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="WhaSlabName"
                    value={updatedData.WhaSlabName}
                    onChange={handleUpdateChange}
                  />
                </div>

                <div className="mb-3 position-relative">
                  <label className="form-label">WEF</label>
                  <div className="position-relative">
                    <ReactDatetime
                      className="form-control pe-5 "
                      name="WhaWEF"
                      value={updatedData.WhaWEF}
                      onChange={handleDateChange}
                      inputProps={{ placeholder: "Select Date and Time" }}
                      timeFormat="HH:mm"
                      dateFormat="YYYY-MM-DD"
                    />
                    <FaCalendarAlt
                      className="position-absolute top-50 end-0 translate-middle-y me-2"
                      style={{ fontSize: "20px", cursor: "pointer" }}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={handleUpdateSubmit}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </>
  );
};

export default View_Slab;
