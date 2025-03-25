import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "./WpApiSetup.css";

const API_URL = "http://147.93.107.44:5000";

const View_WpSetup_Main = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const navigate = useNavigate();
  const [editData, setEditData] = useState({
    ClientName: "",
    WhatsappOffcialName: "",
    OwnerNumber: "",
    Token: "",
    ApiURL: "",
    ApiVersion: "",
    WABAID: "",
    PhoneNumberID: "",
    SuccessKey: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3); // Number of items per page

  const fetchData = () => {
    axios
      .get(`${API_URL}/wha_offcialwa_view_All`)
      .then((res) => {
        setData(res.data.data);
      })
      .catch((error) => {
        toast.error("Error fetching data");
      });
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmDelete) {
      axios
        .get(`${API_URL}/wha_offcialwa_delete/${id}`)
        .then((res) => {
          toast.success("Deleted successfully");
          fetchData();
        })
        .catch((error) => {
          toast.error("Error deleting item");
        });
    }
  };

  const handleEdit = (item) => {
    setEditData({
      _id: item._id,
      ClientName: item.ClientID?.WhaClientName || "",
      WhatsappOffcialName: item.WhatsappOffcialName,
      OwnerNumber: item.OwnerNumber,
      Token: item.Token,
      ApiURL: item.ApiURL,
      ApiVersion: item.ApiVersion,
      WABAID: item.WABAID,
      PhoneNumberID: item.PhoneNumberID,
      SuccessKey: item.SuccessKey,
    });
    setShowModal(true);
  };

  const handleUpdate = () => {
    axios
      .put(`${API_URL}/wha_offcialwa_update/${editData._id}`, editData)
      .then((res) => {
        toast.success("Updated successfully");
        fetchData();
        setShowModal(false);
        setEditData({});
      })
      .catch((error) => {
        toast.error("Error updating item");
      });
  };

  const closeModal = () => {
    setShowModal(false);
    setEditData({});
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter data based on search term
  const filteredData = data.filter((item) =>
    item.WhatsappOffcialName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
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
        <button className="btn btn-primary" style={{ marginRight: "10px" }}>
          WhatsApp API Main
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/View_WpSetupDT")}
        >
          WhatsApp API Details
        </button>
      </div>

      <div className="container-fluid">
        <div className="container-fluid mt-4">
          {/* Search Bar */}
          <div className="d-flex align-items-center mb-3">
            <label
              htmlFor="searchWhatsappOfficialName"
              className="form-label me-2 mb-0 fw-bold"
            >
              Search Whatsapp Official Name:
            </label>
            <div className="input-group" style={{ width: "250px" }}>
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                id="searchWhatsappOfficialName"
                className="form-control"
                placeholder="Search by Whatsapp Official Name"
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
                  <th>Whatsapp Official Name</th>
                  <th>Owner Number</th>
                  <th>Token</th>
                  <th>ApiURL</th>
                  <th>ApiVersion</th>
                  <th>WABAID</th>
                  <th>PhoneNumberID</th>
                  <th>SuccessKey</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <tr key={index} className="text-start align-middle">
                      <td style={{ textAlign: "center" }}>
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td>{item.WhatsappOffcialName || "N/A"}</td>
                      <td>{item.OwnerNumber || "N/A"}</td>
                      <td className="text-wrap token-cell">
                        {item.Token || "N/A"}
                      </td>
                      <td
                        className="text-wrap"
                        style={{ maxWidth: "90px", wordBreak: "break-word" }}
                      >
                        {item.ApiURL || "N/A"}
                      </td>
                      <td>{item.ApiVersion || "N/A"}</td>
                      <td>{item.WABAID || "N/A"}</td>
                      <td>{item.PhoneNumberID || "N/A"}</td>
                      <td>{item.SuccessKey || "N/A"}</td>
                      <td className="text-center">
                        <div className="d-flex flex-column action-buttons">
                          <button
                            className="btn btn-warning btn-responsive mb-2"
                            onClick={() => handleEdit(item)}
                          >
                            Update
                          </button>
                          <button
                            className="btn btn-danger btn-responsive"
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
                    <td
                      colSpan="10"
                      className="text-center text-danger fw-bold"
                    >
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
                  <a className="page-link">Previous</a>
                </li>

                {/* Show first page */}
                {currentPage > 2 && (
                  <li className="page-item" onClick={() => paginate(1)}>
                    <a className="page-link">1</a>
                  </li>
                )}

                {/* Show second page */}
                {currentPage > 3 && (
                  <li className="page-item" onClick={() => paginate(2)}>
                    <a className="page-link">2</a>
                  </li>
                )}

                {/* Ellipses between pages */}
                {currentPage > 3 && (
                  <li className="page-item disabled">
                    <a className="page-link">...</a>
                  </li>
                )}

                {/* Show current page */}
                <li className={`page-item active`}>
                  <a className="page-link">{currentPage}</a>
                </li>

                {/* Ellipses before last page */}
                {currentPage <
                  Math.ceil(filteredData.length / itemsPerPage) - 2 && (
                  <li className="page-item disabled">
                    <a className="page-link">...</a>
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
                    <a className="page-link">
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
                  <a className="page-link">Next</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {showModal && (
          <div
            className="modal show d-block"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <div
              className="modal-dialog"
              style={{ maxWidth: "600px", marginTop: "100px" }}
            >
              <div className="modal-content ">
                <div className="modal-header justify-content-center">
                  <h5 className="modal-title text-center">
                    Update WhatsApp Setup Detail
                  </h5>
                </div>

                <div className="modal-body">
                  <form
                    style={{ maxWidth: "600px", boxShadow: "none" }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleUpdate();
                    }}
                  >
                    {/* Whatsapp Official Name */}
                    <div className="mb-2">
                      <label>Whatsapp Official Name</label>
                      <input
                        type="text"
                        value={editData.WhatsappOffcialName || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            WhatsappOffcialName: e.target.value,
                          })
                        }
                        placeholder="Whatsapp Official Name"
                        className="form-control"
                      />
                    </div>

                    {/* Owner Number and Token */}
                    <div className="d-flex mb-2">
                      <div className="me-2" style={{ flex: 1 }}>
                        <label>Owner Number</label>
                        <input
                          type="text"
                          value={editData.OwnerNumber || ""}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              OwnerNumber: e.target.value,
                            })
                          }
                          placeholder="Owner Number"
                          className="form-control"
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label>Token</label>
                        <input
                          type="text"
                          value={editData.Token || ""}
                          onChange={(e) =>
                            setEditData({ ...editData, Token: e.target.value })
                          }
                          placeholder="Token"
                          className="form-control"
                        />
                      </div>
                    </div>

                    {/* Api URL and Api Version */}
                    <div className="d-flex mb-2">
                      <div className="me-2" style={{ flex: 1 }}>
                        <label>Api URL</label>
                        <input
                          type="text"
                          value={editData.ApiURL || ""}
                          onChange={(e) =>
                            setEditData({ ...editData, ApiURL: e.target.value })
                          }
                          placeholder="Api URL"
                          className="form-control"
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label>Api Version</label>
                        <input
                          type="text"
                          value={editData.ApiVersion || ""}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              ApiVersion: e.target.value,
                            })
                          }
                          placeholder="Api Version"
                          className="form-control"
                        />
                      </div>
                    </div>

                    {/* WABA ID and Phone Number ID */}
                    <div className="d-flex mb-2">
                      <div className="me-2" style={{ flex: 1 }}>
                        <label>WABA ID</label>
                        <input
                          type="text"
                          value={editData.WABAID || ""}
                          onChange={(e) =>
                            setEditData({ ...editData, WABAID: e.target.value })
                          }
                          placeholder="WABA ID"
                          className="form-control"
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label>Phone Number ID</label>
                        <input
                          type="text"
                          value={editData.PhoneNumberID || ""}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              PhoneNumberID: e.target.value,
                            })
                          }
                          placeholder="Phone Number ID"
                          className="form-control"
                        />
                      </div>
                    </div>

                    {/* Success Key */}
                    <div className="mb-2">
                      <label>Success Key</label>
                      <input
                        type="text"
                        value={editData.SuccessKey || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            SuccessKey: e.target.value,
                          })
                        }
                        placeholder="Success Key"
                        className="form-control"
                      />
                    </div>
                  </form>
                  <div className="modal-footer  ms-3">
                    <button
                      type="button"
                      className="btn btn-secondary mr-4"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="btn btn-warning"
                      onClick={handleUpdate}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
};

export default View_WpSetup_Main;
