import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const API_URL = "http://147.93.107.44:5000";

const View_WpSetupDT = () => {
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [formData, setFormData] = useState({
    WhatsappOffcialName: "",
    Parameter: "",
    ISURL: false,
    IsMobile: false,
  });

  // Fetch Data
  const viewData = () => {
    axios
      .get(`${API_URL}/wha_offcialwadt_view_All`)
      .then((res) => {
        setData(res.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
        toast.error("Failed to load data");
      });
  };

  // Delete Data
  const deleteData = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this record?"
    );
    if (confirmDelete) {
      axios
        .get(`${API_URL}/wha_offcialwadt_delete/${id}`)
        .then(() => {
          toast.success("Data deleted successfully");
          setData(data.filter((item) => item._id !== id));
        })
        .catch((error) => {
          console.error("Error deleting data", error);
          toast.error("Failed to delete data");
        });
    }
  };

  // Update Data
  const updateData = (id) => {
    const selected = data.find((item) => item._id === id);
    setSelectedData(selected);
    setFormData({
      WhatsappOffcialName:
        selected.WhatsAppOffcialWaID?.WhatsappOffcialName || "",
      Parameter: selected.Parameter || "",
      ISURL: selected.ISURL || false,
      IsMobile: selected.IsMobile || false,
    });
    setShowPopup(true);
  };

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Submit Update
  const handleSubmit = () => {
    axios
      .put(`${API_URL}/wha_offcialwadt_update/${selectedData._id}`, formData)
      .then(() => {
        toast.success("Data updated successfully");
        setShowPopup(false);
        viewData();
      })
      .catch((error) => {
        console.error("Error updating data", error);
        toast.error("Failed to update data");
      });
  };

  useEffect(() => {
    viewData();
  }, []);

  // Filter data based on search term
  const filteredData = data.filter((item) =>
    item.WhatsAppOffcialWaID?.WhatsappOffcialName.toLowerCase().includes(
      searchTerm.toLowerCase()
    )
  );

  // Paginate Data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
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
              View WhatsApp API Setup
            </h3>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center mt-5">
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/View_WpSetup_Main")}
          style={{ marginRight: "10px" }}
        >
          WhatsApp API Main
        </button>
        <button className="btn btn-primary">WhatsApp API Details</button>
      </div>

      <div className="container mt-4">
        <div
          className="table-wrapper"
          style={{ maxWidth: "900px", margin: "0 auto" }}
        >
          <div className="d-flex align-items-center mb-3">
            <label htmlFor="search" className="form-label me-2 mb-0 fw-bold">
              Search Whatsapp Offcial Name:
            </label>
            <div className="input-group" style={{ width: "280px" }}>
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                id="search"
                className="form-control"
                placeholder="Search By WP Offcial Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-primary text-center">
                <tr>
                  <th>No</th>
                  <th>Whatsapp Offcial Name</th>
                  <th>Parameter</th>
                  <th>ISURL</th>
                  <th>IsMobile</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="text-start">
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <tr key={index}>
                      <td style={{ textAlign: "center" }}>
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td>
                        {item.WhatsAppOffcialWaID?.WhatsappOffcialName || "N/A"}
                      </td>
                      <td>{item.Parameter}</td>
                      <td>
                        {item.ISURL
                          ? "True".toUpperCase()
                          : "False".toUpperCase()}
                      </td>
                      <td>
                        {item.IsMobile
                          ? "True".toUpperCase()
                          : "False".toUpperCase()}
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-warning mx-2"
                          onClick={() => updateData(item._id)}
                        >
                          Update
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => deleteData(item._id)}
                        >
                          Delete
                        </button>
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
          </div>

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
                <li className={`page-item active`}>
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

        {/* Modal for Updating Data */}
        {showPopup && (
          <div
            className="modal fade show "
            style={{ display: "block" }}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content ">
                <div className="modal-header">
                  <h5 className="modal-title">Update Data</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowPopup(false)}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">
                      Whatsapp Official Name:
                    </label>
                    <input
                      type="text"
                      name="WhatsappOffcialName"
                      value={formData.WhatsappOffcialName}
                      onChange={handleChange}
                      className="form-control"
                      readOnly
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Parameter:</label>
                    <input
                      type="text"
                      name="Parameter"
                      value={formData.Parameter}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="ISURL"
                      checked={formData.ISURL}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">Is URL</label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="IsMobile"
                      checked={formData.IsMobile}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">Is Mobile</label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowPopup(false)}
                  >
                    Close
                  </button>
                  <button className="btn btn-warning" onClick={handleSubmit}>
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </div>
  );
};

export default View_WpSetupDT;
