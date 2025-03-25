import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const API_URL = "http://147.93.107.44:5000";

const ViewCleintDT = () => {
  const [clientData, setClientData] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [whaSlabOptions, setWhaSlabOptions] = useState([]);
  const [formData, setFormData] = useState({
    WhaClientName: "",
    WhaSlabDtID: "",
    WhaCount: "",
    WhaBalCount: "",
    WhaDate: "",
  });
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [itemsPerPage] = useState(5); // Max 5 items per page
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch client data
    axios
      .get(`${API_URL}/clientdt_view_All`)
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          setClientData(response.data.data);
        } else {
          console.error("Data is not an array", response.data);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the client data!", error);
        toast.error("Error fetching client data!");
      });

    // Fetch slab data
    axios
      .get(`${API_URL}/slabdt_view`)
      .then((res) => {
        console.log("Fetched slabs:", res.data);
        if (Array.isArray(res.data)) {
          setWhaSlabOptions(res.data);
        } else if (Array.isArray(res.data.data)) {
          setWhaSlabOptions(res.data.data);
        } else {
          toast.error("Error: Slabs data is not an array");
        }
      })
      .catch(() => {
        toast.error("Error fetching slabs!");
        console.error("Error fetching slabs");
      });
  }, []);

  // Filter client data based on search term
  const filteredClientData = clientData.filter((client) =>
    client?.WhaClientID?.WhaClientName.toLowerCase().includes(
      searchTerm.toLowerCase()
    )
  );

  // Paginate the filtered data
  const indexOfLastClient = currentPage * itemsPerPage;
  const indexOfFirstClient = indexOfLastClient - itemsPerPage;
  const currentClients = filteredClientData.slice(
    indexOfFirstClient,
    indexOfLastClient
  );

  const handleDelete = (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this data permanently?"
    );
    if (isConfirmed) {
      axios
        .get(`${API_URL}/clientdt_delete/${id}`)
        .then((response) => {
          toast.success("Client data deleted successfully!");
          setClientData(clientData.filter((client) => client._id !== id));
        })
        .catch((error) => {
          console.error("There was an error deleting the client data!", error);
          toast.error("Error deleting client data!");
        });
    }
  };

  const handleUpdate = (client) => {
    setSelectedClient(client);
    setFormData({
      WhaClientName: client?.WhaClientID?.WhaClientName || "",
      WhaSlabDtID: client?.WhaSlabDtID?._id || "",
      WhaCount: client.WhaCount || "",
      WhaBalCount: client.WhaBalCount || "",
      WhaDate: client.WhaDate || "",
    });
    setShowUpdateModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "WhaDate") {
      const currentTime = new Date();
      const hours = String(currentTime.getHours()).padStart(2, "0");
      const minutes = String(currentTime.getMinutes()).padStart(2, "0");
      const currentTimeString = `${hours}:${minutes}`;
      const dateTime = `${value} ${currentTimeString}`;
      setFormData((prevData) => ({
        ...prevData,
        [name]: dateTime,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`${API_URL}/clientdt_update/${selectedClient._id}`, formData)
      .then((response) => {
        toast.success("Client data updated successfully!");
        axios.get(`${API_URL}/clientdt_view_All`).then((res) => {
          setClientData(res.data.data);
        });
        setShowUpdateModal(false);
      })
      .catch((error) => {
        console.error("There was an error updating the client data!", error);
        toast.error("Error updating client data!");
      });
  };

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
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
              View Client Detail
            </h3>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center mt-5 align-items-center">
        <button
          className="btn btn-secondary me-2"
          onClick={() => navigate("/View_Cleint")}
        >
          Client Data
        </button>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/View_CleintDT")}
        >
          Client Details
        </button>
      </div>

      <div className="container mt-4">
        <div className="table-responsive-wrapper">
          <div className="search-container d-flex align-items-center mb-3">
            <label
              htmlFor="searchClient"
              className="form-label me-2 mb-0 fw-bold"
            >
              Search Client:
            </label>
            <div className="input-group search-input">
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                id="searchClient"
                className="form-control"
                placeholder="Search by client name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-primary text-center uppercase">
                <tr>
                  <th>No</th>
                  <th>Client Name</th>
                  <th>Slab Name</th>
                  <th>Total Balance</th>
                  <th>Balance</th>
                  <th>Date-Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentClients.length > 0 ? (
                  currentClients.map((client, index) => {
                    const date = new Date(client.WhaDate);
                    const formattedDate = `${String(date.getDate()).padStart(
                      2,
                      "0"
                    )}-${String(date.getMonth() + 1).padStart(
                      2,
                      "0"
                    )}-${date.getFullYear()}`;
                    const formattedTime = `${String(date.getHours()).padStart(
                      2,
                      "0"
                    )}:${String(date.getMinutes()).padStart(2, "0")}`;

                    return (
                      <tr key={index} className="text-left">
                        <td style={{ textAlign: "center" }}>{index + 1}</td>
                        <td className="uppercase">
                          {client?.WhaClientID?.WhaClientName}
                        </td>
                        <td className="uppercase">
                          {client?.WhaSlabDtID
                            ? client.WhaSlabDtID.WhaSlabID?.WhaSlabName || "N/A"
                            : "N/A"}
                        </td>
                        <td>{parseFloat(client.WhaCount).toFixed(2)}</td>
                        <td>{parseFloat(client.WhaBalCount).toFixed(2)}</td>
                        <td>{`${formattedDate} ${formattedTime}`}</td>
                        <td>
                          <div className="d-flex justify-content-center">
                            <button
                              className="btn btn-warning me-2"
                              onClick={() => handleUpdate(client)}
                            >
                              Update
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => handleDelete(client._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-danger fw-bold">
                      No matching records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination-container d-flex justify-content-end mt-4">
            <nav aria-label="Page navigation example">
              <ul className="pagination justify-content-center">
                {/* Pagination logic here */}
                <div className="d-flex justify-content-end mt-4">
                  <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-center">
                      <li
                        className={`page-item ${
                          currentPage === 1 ? "disabled" : ""
                        }`}
                        onClick={() =>
                          currentPage > 1 && paginate(currentPage - 1)
                        }
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
                        Math.ceil(filteredClientData.length / itemsPerPage) -
                          2 && (
                        <li className="page-item disabled">
                          <a className="page-link" href="#">
                            ...
                          </a>
                        </li>
                      )}

                      {/* Show last page */}
                      {currentPage <
                        Math.ceil(filteredClientData.length / itemsPerPage) -
                          1 && (
                        <li
                          className="page-item"
                          onClick={() =>
                            paginate(
                              Math.ceil(
                                filteredClientData.length / itemsPerPage
                              )
                            )
                          }
                        >
                          <a className="page-link" href="#">
                            {Math.ceil(
                              filteredClientData.length / itemsPerPage
                            )}
                          </a>
                        </li>
                      )}

                      <li
                        className={`page-item ${
                          currentPage ===
                          Math.ceil(filteredClientData.length / itemsPerPage)
                            ? "disabled"
                            : ""
                        }`}
                        onClick={() =>
                          currentPage <
                            Math.ceil(
                              filteredClientData.length / itemsPerPage
                            ) && paginate(currentPage + 1)
                        }
                      >
                        <a className="page-link" href="#">
                          Next
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </ul>
            </nav>
          </div>
        </div>

        <ToastContainer />

        {showUpdateModal && (
          <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex="-1"
            aria-labelledby="updateModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{ maxWidth: "400px" }}>
                <div className="modal-header">
                  <h5 className="modal-title uppercase" id="updateModalLabel">
                    Update Client Data
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowUpdateModal(false)}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <form
                    style={{ boxShadow: "none" }}
                    onSubmit={handleUpdateSubmit}
                  >
                    <div className="mb-3">
                      <label
                        htmlFor="WhaClientName"
                        className="form-label uppercase"
                      >
                        Client Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="WhaClientName"
                        name="WhaClientName"
                        value={formData.WhaClientName}
                        onChange={handleFormChange}
                        readOnly
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="WhaSlabDtID"
                        className="form-label uppercase"
                      >
                        Slab Name
                      </label>
                      <select
                        name="WhaSlabDtID"
                        className="form-select"
                        id="WhaSlabDtID"
                        onChange={handleFormChange}
                        value={formData.WhaSlabDtID}
                      >
                        <option value="">Select Slab Name</option>
                        {whaSlabOptions?.map((item) => (
                          <option key={item?._id} value={item?._id}>
                            {item?.WhaSlabID?.WhaSlabName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="WhaCount"
                        className="form-label uppercase"
                      >
                        Total Balance
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="WhaCount"
                        name="WhaCount"
                        value={
                          formData.WhaCount ? parseFloat(formData.WhaCount) : ""
                        }
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="WhaBalCount"
                        className="form-label uppercase"
                      >
                        Balance
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="WhaBalCount"
                        name="WhaBalCount"
                        value={
                          formData.WhaBalCount
                            ? parseFloat(formData.WhaBalCount)
                            : ""
                        }
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="WhaDate" className="form-label uppercase">
                        Date-Time
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="WhaDate"
                        name="WhaDate"
                        value={formData.WhaDate.split(" ")[0]}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowUpdateModal(false)}
                      >
                        Close
                      </button>
                      <button type="submit" className="btn btn-warning">
                        Update
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCleintDT;
