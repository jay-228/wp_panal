import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "./WpDocumentLinkSetup.css";

const API_URL = "http://147.93.107.44:5000";

const View_DocumentLink_main = () => {
  const [data, setData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page

  useEffect(() => {
    axios
      .get(`${API_URL}/wha_doclink_view_All`)
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          setData(response.data.data);
        } else {
          console.error("Expected an array but received:", response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data!");
      });
  }, []);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmDelete) {
      const url = `${API_URL}/wha_doclink_delete/${id}`;
      axios
        .get(url)
        .then((response) => {
          setData((prevData) => prevData.filter((item) => item._id !== id));
          toast.success("Item deleted successfully!");
        })
        .catch((error) => {
          console.error("Error deleting item:", error);
          toast.error("Error deleting item!");
        });
    }
  };

  const handleUpdate = (item) => {
    setEditingId(item._id);
    setFormData({
      DocLinkName: item.DocLinkName || "",
      WHADOcLinkURL: item.WHADOcLinkURL || "",
      WHADOcURLKey: item.WHADOcURLKey || "",
    });
    setShowPopup(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = `${API_URL}/wha_doclink_update/${editingId}`;
    axios
      .put(url, formData)
      .then((response) => {
        setData((prevData) =>
          prevData.map((item) =>
            item._id === editingId
              ? {
                  ...item,
                  ...formData,
                }
              : item
          )
        );
        setShowPopup(false);
        toast.success("Item updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating item:", error);
        toast.error("Error updating item!");
      });
  };

  // Filter data based on search term
  const filteredData = data.filter((item) =>
    item.DocLinkName?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
              className="rounded-2 m-0 px-5 text-white "
              style={{ backgroundColor: "black" }}
            >
              View Document Link Setup
            </h3>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center mt-5">
        <button className="btn btn-primary" style={{ marginRight: "10px" }}>
          View Document Link Main
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/View_DocumentLinkDT")}
        >
          View Document Link Details
        </button>
      </div>

      <div className="container mt-4">
        <div
          className="table-wrapper"
          style={{ maxWidth: "1200px", margin: "0 auto" }}
        >
          <div className="container mt-4">
            <div className="d-flex align-items-center mb-3">
              <label
                htmlFor="documentLinkSearch"
                className="form-label me-2 mb-0 fw-bold"
              >
                Search Document Link Name
              </label>
              <div className="input-group" style={{ width: "250px" }}>
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  id="documentLinkSearch"
                  className="form-control"
                  placeholder="Search By Document Link Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="table-responsive scroll-container">
            <table className="table table-bordered table-hover">
              <thead className="table-primary text-center">
                <tr>
                  <th className="text-center">No</th>
                  <th className="text-center">Document Link Name</th>
                  <th className="text-center">Document Link URL</th>
                  <th className="text-center">Document URL Key</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-start">
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td>{item.DocLinkName}</td>
                      <td>{item.WHADOcLinkURL}</td>
                      <td>{item.WHADOcURLKey}</td>
                      <td className="text-center">
                        <button
                          onClick={() => handleUpdate(item)}
                          className="btn btn-warning"
                          style={{ marginRight: "20px" }}
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
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

      {showPopup && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered ">
            <div className="modal-content">
              <div className="modal-header ">
                <h5 className="modal-title ">Document Link Update </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowPopup(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Document Link Name</label>
                  <input
                    type="text"
                    name="DocLinkName"
                    value={formData.DocLinkName || ""}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Document Link URL</label>
                  <input
                    type="text"
                    name="WHADOcLinkURL"
                    value={formData.WHADOcLinkURL || ""}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Document URL Key</label>
                  <input
                    type="text"
                    name="WHADOcURLKey"
                    value={formData.WHADOcURLKey || ""}
                    onChange={handleChange}
                    className="form-control"
                  />
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

      <ToastContainer />
    </>
  );
};

export default View_DocumentLink_main;
