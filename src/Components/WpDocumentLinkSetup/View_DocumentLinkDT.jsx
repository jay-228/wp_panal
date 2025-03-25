import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "./WpDocumentLinkSetup.css";

const API_URL = "http://147.93.107.44:5000";

const View_DocumentLinkDT = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [DocLinkName, setDocLinkName] = useState([]); // State to store DocLinkName options
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    DocLinkName: "",
    WhaDocLinkID: "", // Add WhaDocLinkID to formData
    DocHeaderName: "",
    DocHeaderValue: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    fetchData();
    fetchDocLinkNameOptions();
  }, []);

  const fetchData = () => {
    axios
      .get(`${API_URL}/wha_doclinkdt_view_All`)
      .then((response) => {
        const fetchedData = response.data;
        if (Array.isArray(fetchedData)) {
          setData(fetchedData);
        } else if (fetchedData.data && Array.isArray(fetchedData.data)) {
          setData(fetchedData.data);
        } else {
          console.error("Expected an array, but received:", fetchedData);
        }
      })
      .catch((error) => {
        toast.error("Error fetching data");
      });
  };

  const fetchDocLinkNameOptions = () => {
    axios
      .get(`${API_URL}/wha_doclink_view_All`)
      .then((response) => {
        setDocLinkName(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching DocLinkName options:", error);
        toast.error("Error fetching DocLinkName options!");
      });
  };

  const handleUpdateClick = (item) => {
    setEditingId(item._id);
    setFormData({
      DocLinkName: item.WhaDocLinkID?.DocLinkName || "",
      WhaDocLinkID: item.WhaDocLinkID?._id || "", // Set WhaDocLinkID
      DocHeaderName: item.DocHeaderName || "",
      DocHeaderValue: item.DocHeaderValue || "",
    });
    setShowModal(true);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      axios
        .get(`${API_URL}/wha_doclinkdt_delete/${id}`)
        .then((response) => {
          setData((prevData) => prevData.filter((item) => item._id !== id));
          toast.success("Item deleted successfully");
        })
        .catch((error) => {
          toast.error("Error deleting item");
        });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`${API_URL}/wha_doclinkdt_update/${editingId}`, formData)
      .then((response) => {
        fetchData(); // Re-fetch data to ensure the table is updated
        toast.success("Item updated successfully");
        setShowModal(false);
        console.log("Data updated successfully:", response.data);
      })
      .catch((error) => {
        toast.error("Error updating item");
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page when search query changes
  };

  const filteredData = data.filter((item) => {
    const docLinkName = item.WhaDocLinkID?.DocLinkName;
    return docLinkName
      ? docLinkName.toLowerCase().includes(searchQuery.toLowerCase())
      : false;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

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
              View Document Link Setup
            </h3>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center mt-5">
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/View_DocumentLink_main")}
          style={{ marginRight: "10px" }}
        >
          View Document Link Main
        </button>
        <button className="btn btn-primary">View Document Link Details</button>
      </div>

      <div className="container mt-4">
        <ToastContainer />

        <div
          className="table-wrapper"
          style={{ maxWidth: "1000px", margin: "0 auto" }}
        >
          <div className="d-flex align-items-center mb-3">
            <label className="form-label me-2 mb-0 fw-bold">
              Search WhaDocLinkName
            </label>
            <div className="input-group " style={{ width: "280px" }}>
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search By WhaDocLinkName"
              />
            </div>
          </div>

          {/* Responsive Table with Horizontal Scroll */}
          <div className="table-responsive " style={{ overflowX: "auto" }}>
            <table className="table table-bordered table-hover">
              <thead className="table-primary text-center">
                <tr>
                  <th className="text-center">No</th>
                  <th className="text-center">WhaDocLinkName</th>
                  <th className="text-center">DocHeaderName</th>
                  <th className="text-center">DocHeaderValue</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="text-start">
                        {item.WhaDocLinkID?.DocLinkName || "N/A"}
                      </td>
                      <td className="text-start">
                        {item.DocHeaderName|| "N/A"}
                      </td>
                      <td className="text-start">
                        {item.DocHeaderValue || "N/A"}
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2 flex-wrap">
                          <button
                            className="btn btn-warning"
                            onClick={() => handleUpdateClick(item)}
                          >
                            Update
                          </button>
                          <button
                            className="btn btn-danger"
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
                    <td colSpan="5" className="text-center text-danger fw-bold">
                      No matching records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-end mt-4  pg">
            <nav aria-label="Page navigation example ">
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

        {/* Modal for Update */}
        {showModal && (
          <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Update Document Link</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                    aria-label="Close"
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">DocLinkName</label>
                    <select
                      name="DocLinkName"
                      value={formData.DocLinkName}
                      onChange={(e) => {
                        const selectedOption = DocLinkName.find(
                          (item) => item.DocLinkName === e.target.value
                        );
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          DocLinkName: e.target.value,
                          WhaDocLinkID: selectedOption?._id || "", // Set WhaDocLinkID
                        }));
                      }}
                      className="form-select"
                    >
                      <option value="">Select Name</option>
                      {DocLinkName.map((item) => (
                        <option key={item._id} value={item.DocLinkName}>
                          {item.DocLinkName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">DocHeaderName</label>
                    <input
                      type="text"
                      name="DocHeaderName"
                      value={formData.DocHeaderName || ""}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">DocHeaderValue</label>
                    <input
                      type="text"
                      name="DocHeaderValue"
                      value={formData.DocHeaderValue || ""}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="btn btn-warning"
                    onClick={handleFormSubmit}
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <style>{`
        .table td, .table th {
          text-align: center;
        }
      `}</style>
      </div>
    </div>
  );
};

export default View_DocumentLinkDT;
