import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const API_URL = "http://147.93.107.44:5000";

const View_SlabDT = () => {
  const token = JSON.parse(localStorage.getItem("authToken"));
  const [slabData, setSlabData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  const [selectedSlab, setSelectedSlab] = useState({
    WhaSlabID: { WhaSlabName: "" },
    FromMSGToMSG: "",
    Price: "",
    ModifyDate: "", // Add ModifyDate to the state
  });
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Define how many items per page
  const navigate = useNavigate();

  const fetchData = () => {
    axios
      .get(`${API_URL}/slabdt_view`, {
        headers: {
          Authorization: token,
          "Cache-Control": "no-store",
        },
      })
      .then((res) => {
        console.log("API Response:", res.data.data); // Log the API response
        setSlabData(res.data.data);
      })
      .catch((error) => {
        toast.error("Error fetching slab data!");
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this slab?")) {
      axios
        .get(`${API_URL}/slabdt_delete/${id}`, {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          fetchData(); // Refresh the data after deletion
          toast.success("Slab deleted successfully!");
        })
        .catch((error) => {
          toast.error("Error deleting slab!");
        });
    }
  };

  const handleUpdate = (slab) => {
    setSelectedSlab(slab); // Set the selected slab data to be updated
    setModalVisible(true); // Show the modal
  };

  const handleSubmit = () => {
    const updatedSlab = {
      ...selectedSlab,
      ModifyDate: selectedSlab.ModifyDate
        ? `${selectedSlab.ModifyDate.split(" ")[0]} ${new Date()
            .toTimeString()
            .slice(0, 5)}` // Append current time to the selected date in HH:MM format
        : new Date().toISOString().slice(0, 16).replace("T", " "), // Default to current date and time in YYYY-MM-DD HH:MM format
    };

    axios
      .put(`${API_URL}/slabdt_update/${selectedSlab._id}`, updatedSlab, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        setModalVisible(false); // Close the modal after updating
        fetchData(); // Refresh the data after update
        toast.success("Slab updated successfully!");
      })
      .catch((error) => {
        toast.error("Error updating slab!");
      });
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // Automatically update ModifyDate when Price changes
  useEffect(() => {
    if (selectedSlab.Price) {
      const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
      const currentTime = new Date().toTimeString().slice(0, 5); // Get current time in HH:MM format
      setSelectedSlab((prev) => ({
        ...prev,
        ModifyDate: `${currentDate} ${currentTime}`,
      }));
    }
  }, [selectedSlab.Price]);

  const filteredData = slabData.filter((item) =>
    item?.WhaSlabID?.WhaSlabName.toLowerCase().includes(
      searchTerm.toLowerCase()
    )
  );

  // Pagination logic
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Get current items for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      {/* Header Section */}
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

      {/* Search Bar */}
      <div className="container mt-4">
        <div className="d-flex justify-content-center mt-5">
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/View_Slab")}
            style={{ marginRight: "10px" }}
          >
            {showActiveOnly ? "Slab Data" : "Slab Data"}
          </button>
          <button className="btn btn-pry btn-primary">Slab Details</button>
        </div>

        {/* Table Container */}
        <div
          className="table-responsive"
          style={{ maxWidth: "1000px", margin: "0 auto" }}
        >
          <div
            className="d-flex align-items-center mb-3"
            style={{ marginTop: "40px" }}
          >
            <label htmlFor="search" className="form-label me-2 mb-0 fw-bold">
              Search Slab:
            </label>
            <div className="input-group" style={{ width: "250px" }}>
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search By Slab Name"
              />
            </div>
          </div>

          <table className="table table-bordered table-hover">
            <thead className="table-primary text-center">
              <tr>
                <th>No</th>
                <th>Slab Name</th>
                <th>Range</th>
                <th>Price</th>
                <th>Modify Date</th> {/* Add Modify Date column */}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <tr key={item._id} className="text-start">
                    <td style={{ textAlign: "center" }}>{index + 1}</td>
                    <td style={{ textTransform: "uppercase" }}>
                      {item?.WhaSlabID?.WhaSlabName}
                    </td>
                    <td>{item?.FromMSGToMSG}</td>
                    <td>
                      {item?.Price
                        ? parseFloat(item?.Price).toFixed(2)
                        : "0.00"}
                    </td>
                    <td>{item?.ModifyDate || "N/A"}</td>{" "}
                    {/* Display Modify Date */}
                    <td className="text-center">
                      <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
                        <button
                          className="btn btn-warning py-2 px-3"
                          onClick={() => handleUpdate(item)}
                        >
                          Update
                        </button>
                        <button
                          className="btn btn-danger py-2 px-3"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-danger fw-bold">
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
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                  onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                >
                  <a className="page-link" href="#">
                    Previous
                  </a>
                </li>

                {currentPage > 2 && (
                  <li className="page-item" onClick={() => paginate(1)}>
                    <a className="page-link" href="#">
                      1
                    </a>
                  </li>
                )}

                {currentPage > 3 && (
                  <li className="page-item" onClick={() => paginate(2)}>
                    <a className="page-link" href="#">
                      2
                    </a>
                  </li>
                )}

                {currentPage > 3 && (
                  <li className="page-item disabled">
                    <a className="page-link" href="#">
                      ...
                    </a>
                  </li>
                )}

                <li className={`page-item active`}>
                  <a className="page-link" href="#">
                    {currentPage}
                  </a>
                </li>

                {currentPage <
                  Math.ceil(filteredData.length / itemsPerPage) - 2 && (
                  <li className="page-item disabled">
                    <a className="page-link" href="#">
                      ...
                    </a>
                  </li>
                )}

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

      {/* Modal for updating slab data */}
      {modalVisible && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
          aria-labelledby="modalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="modalLabel">
                  Update Slab Detail
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalVisible(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="slabName" className="form-label">
                    Slab Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="slabName"
                    value={selectedSlab?.WhaSlabID?.WhaSlabName}
                    readOnly
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="messageRange" className="form-label">
                    Range
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="messageRange"
                    value={selectedSlab?.FromMSGToMSG}
                    onChange={(e) =>
                      setSelectedSlab({
                        ...selectedSlab,
                        FromMSGToMSG: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="price" className="form-label">
                    Price
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="price"
                    value={selectedSlab?.Price}
                    onChange={(e) =>
                      setSelectedSlab({
                        ...selectedSlab,
                        Price: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalVisible(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={handleSubmit}
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

export default View_SlabDT;
