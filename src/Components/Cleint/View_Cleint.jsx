import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./Cleint.css";

const API_URL = "http://147.93.107.44:5000";

const View_Client = () => {
  const token = JSON.parse(localStorage.getItem("authToken"));
  const [ClientData, setClientData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentClient, setCurrentClient] = useState({
    _id: "",
    WhaClientName: "",
    WhaCount: "",
    WhaBalCount: "",
    IsAdmin: false,
    IsActive: false,
    StaticIP: "",
    IsOWNWhatsapp: false,
    Database: "",
    Password: "",
    UserName: "",
    Port: "",
    AdminID: null,
    DocLink: {
      _id: "",
      ClientID: "",
      DocLinkName: "",
      WHADOcLinkURL: "",
      WHADOcURLKey: "",
      __v: 0,
    },
    WhatsAppOffcialWa: {
      _id: "",
      WhatsappOffcialName: "",
    },
    Templates: [],
    FolderName: "",
  });

  const navigate = useNavigate();
  const [adminName, setAdminNames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page
  const [clientNames, setClientNames] = useState([]);
  const [WhaDocu, setWhaDocu] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [WhatClient, setWhatClient] = useState([]);

  // Fetch client and admin data
  const fetchData = async () => {
    try {
      // Fetch all data concurrently using Promise.all
      const [
        clientResponse,
        adminResponse,
        docLinkResponse,
        whatsAppResponse,
        templateResponse,
      ] = await Promise.all([
        axios.get(`${API_URL}/client_view_All`, {
          headers: {
            Authorization: token,
            "Cache-Control": "no-store",
          },
        }),
        axios.get(`${API_URL}/admin_view`),
        axios.get(`${API_URL}/wha_doclink_view_All`),
        axios.get(`${API_URL}/wha_offcialwa_view_All`),
        axios.get(`${API_URL}/template_view`),
      ]);

      // Set client data
      setClientData(clientResponse.data.data);
      console.log("Client Data:", clientResponse.data.data);

      // Set admin data
      setAdminNames(adminResponse.data.data);
      console.log("Admin Data:", adminResponse.data.data);

      // Set document link data
      if (Array.isArray(docLinkResponse.data.data)) {
        setWhaDocu(docLinkResponse.data.data);
      } else {
        console.error(
          "Expected an array but received:",
          docLinkResponse.data.data
        );
      }

      // Set WhatsApp client data
      setWhatClient(whatsAppResponse.data.data);
      console.log("WhatsApp Client Data:", whatsAppResponse.data.data);

      // Set templates data
      const uniqueTemplates = Array.from(
        new Set(templateResponse.data.data.map((item) => item._id)) // Use _id instead of FormatID
      ).map((id) => {
        return templateResponse.data.data.find((item) => item._id === id);
      });
      console.log("Unique Templates:", uniqueTemplates);
      setTemplates(uniqueTemplates || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching data!");
    }
  };

  // Fetch data on component mount or when token changes
  useEffect(() => {
    fetchData();
  }, [token]);

  // Delete a client
  const deleteClient = async (clientId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this client?"
    );
    if (isConfirmed) {
      try {
        await axios.get(`${API_URL}/client_delete/${clientId}`, {
          headers: {
            Authorization: token,
          },
        });
        // Update the state to remove the deleted client
        setClientData((prevData) =>
          prevData.filter((client) => client._id !== clientId)
        );
        toast.success("Client deleted successfully");
      } catch (error) {
        toast.error("Error deleting client");
      }
    }
  };

  // Update a client
  const updateClient = async () => {
    const updatedClient = {
      ...currentClient,
      AdminID: currentClient.AdminID ? currentClient.AdminID._id : null,
      

    };

    
    console.log(updatedClient);

    try {
      const res = await axios.put(
        `${API_URL}/client_update/${currentClient._id}`,
        updatedClient,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log("Update response:", res.data);

      // Update the client list properly
      setClientData((prevData) =>
        prevData.map((client) =>
          client._id === currentClient._id
            ? { ...updatedClient, AdminID: currentClient.AdminID }
            : client
        )
      );

      setShowModal(false);
      toast.success("Client updated successfully");

      // Refresh the page after successful update
      window.location.reload();
    } catch (error) {
      console.error("Error updating client:", error);
      toast.error("Error updating client");
    }
  };

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "Adminname") {
      const selectedAdmin = adminName.find((admin) => admin._id === value);
      setCurrentClient((prevState) => ({
        ...prevState,
        AdminID: selectedAdmin
          ? { _id: selectedAdmin._id, AdminName: selectedAdmin.AdminName }
          : null,
        [name]: value,
      }));
    } else if (name.startsWith("DocLink.")) {
      const field = name.split(".")[1];
      setCurrentClient((prevState) => ({
        ...prevState,
        DocLink: {
          ...prevState.DocLink,
          [field]: value,
        },
      }));
    } else if (name === "DocLink") {
      const selectedDocLink = WhaDocu.find((doc) => doc._id === value);
      setCurrentClient((prevState) => ({
        ...prevState,
        DocLink: selectedDocLink || { _id: "", DocLinkName: "" },
      }));
    } else if (name === "WhatsAppOffcialWa") {
      const selectedWhatsAppClient = WhatClient.find(
        (client) => client._id === value
      );
      setCurrentClient((prevState) => ({
        ...prevState,
        WhatsAppOffcialWa: selectedWhatsAppClient || {
          _id: "",
          WhatsappOffcialName: "",
        },
      }));
    } else if (name === "Templates") {
      const selectedTemplate = templates.find(
        (template) => template._id === value
      );
      if (selectedTemplate) {
        const ids = templates
          .filter((template) => template.FormatID === selectedTemplate.FormatID)
          .map((template) => template._id);
        setCurrentClient((prevState) => ({
          ...prevState,
          Templates: ids,
        }));
      } else {
        setCurrentClient((prevState) => ({
          ...prevState,
          Templates: [],
        }));
      }
    } else {
      setCurrentClient((prevState) => ({
        ...prevState,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Open the update modal and set the current client data
  const openUpdateModal = (client) => {
    setCurrentClient({
      ...client,
      Adminname: client?.AdminID?._id || "",
      Templates: client.Templates || [], // Ensure Templates are set correctly
    });
    setShowModal(true);
  };

  // Filter client data based on search term
  const filteredClientData = ClientData.filter((client) =>
    client.WhaClientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClientData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
              View Client Detail
            </h3>
          </div>
        </div>
      </div>

      {/* Buttons for toggling active clients and navigating */}
      <div className="d-flex justify-content-center mt-5 responsive-buttons">
        <button
          className="btn btn-primary responsive-btn"
          onClick={() => setShowActiveOnly(!showActiveOnly)}
          style={{ marginRight: "10px" }}
        >
          {showActiveOnly ? "Client Data" : "Client Data"}
        </button>
        <button
          className="btn btn-secondary responsive-btn"
          onClick={() => navigate("/View_CleintDT")}
        >
          Client Details
        </button>
      </div>

      {/* Search Bar */}
      <div className="container-fluid my-4 responsive-search">
        <div className="d-flex align-items-center mb-3">
          <label
            htmlFor="searchClient"
            className="form-label me-2 mb-0 fw-bold"
          >
            Search Client:
          </label>
          <div className="input-group responsive-input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control responsive-input"
              id="searchClient"
              placeholder="Search by client name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Client Data Table */}
        <div className="table-responsive responsive-table">
          <table className="table table-bordered table-hover text-left">
            <thead className="table-primary text-center">
              <tr>
                <th>NO</th>
                <th>Client Name</th>
                <th>Admin Name</th>
                <th>Total Balance</th>
                <th>Balance</th>
                <th>Admin</th>
                <th>Active</th>
                <th>Static IP</th>
                <th>Own Whatsapp</th>
                <th>Database</th>
                <th>UserName</th>
                <th>Port</th>
                <th>Folder Name</th>
                <th>Document Link Main Client</th>
                <th>WP API Setup Client</th>
                <th>Format ID</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <tr key={index}>
                    <td data-label="NO" style={{ textAlign: "center" }}>
                      {index + 1}
                    </td>
                    <td data-label="CLIENT NAME">
                      {item?.WhaClientName || "N/A"}
                    </td>
                    <td data-label="ADMIN NAME">
                      {item?.AdminID?.AdminName || "N/A"}
                    </td>
                    <td data-label="COUNT">
                      {item?.WhaCount
                        ? parseFloat(item?.WhaCount).toFixed(2)
                        : "0.00"}
                    </td>
                    <td data-label="BALANCE COUNT">
                      {item?.WhaBalCount
                        ? parseFloat(item?.WhaBalCount).toFixed(2)
                        : "0.00"}
                    </td>
                    <td data-label="IS ADMIN">
                      {item?.IsAdmin !== undefined
                        ? item.IsAdmin.toString()
                        : "N/A"}
                    </td>
                    <td data-label="IS ACTIVE">
                      {item?.IsActive !== undefined
                        ? item.IsActive.toString()
                        : "N/A"}
                    </td>
                    <td data-label="STATIC IP">{item?.StaticIP || "N/A"}</td>
                    <td data-label="IS OWN WHATSAPP">
                      {item?.IsOWNWhatsapp !== undefined
                        ? item.IsOWNWhatsapp.toString()
                        : "N/A"}
                    </td>
                    <td data-label="DATABASE">{item?.Database || "N/A"}</td>
                    <td data-label="USERNAME">{item?.UserName || "N/A"}</td>
                    <td data-label="PORT">{item?.Port || "N/A"}</td>
                    <td data-label="FolderName">{item?.FolderName || "N/A"}</td>

                    <td data-label="DocLink">
                      {item?.DocLink?.DocLinkName || "N/A"}
                    </td>

                    <td data-label="WhatsAppOffcialWa">
                      {item?.WhatsAppOffcialWa?.WhatsappOffcialName || "N/A"}
                    </td>
                    <td data-label="Templates">
                      {item?.Templates?.length
                        ? item.Templates.map(
                            (template) => template.FormatID
                          ).join(", ")
                        : "N/A"}
                    </td>

                    <td data-label="ACTION">
                      <div className="d-flex flex-column justify-content-center gap-2">
                        <button
                          className="btn btn-warning w-100"
                          style={{ height: "40px" }}
                          onClick={() => openUpdateModal(item)}
                        >
                          UPDATE
                        </button>
                        <button
                          className="btn btn-danger w-100"
                          style={{ height: "40px" }}
                          onClick={() => deleteClient(item._id)}
                        >
                          DELETE
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="17" className="text-center text-danger fw-bold">
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-end mt-4 responsive-pagination">
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
                Math.ceil(filteredClientData.length / itemsPerPage) - 2 && (
                <li className="page-item disabled">
                  <a className="page-link" href="#">
                    ...
                  </a>
                </li>
              )}

              {/* Show last page */}
              {currentPage <
                Math.ceil(filteredClientData.length / itemsPerPage) - 1 && (
                <li
                  className="page-item"
                  onClick={() =>
                    paginate(
                      Math.ceil(filteredClientData.length / itemsPerPage)
                    )
                  }
                >
                  <a className="page-link" href="#">
                    {Math.ceil(filteredClientData.length / itemsPerPage)}
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
                    Math.ceil(filteredClientData.length / itemsPerPage) &&
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

      {/* Update Client Modal */}
      {showModal && (
        <div
          className="modal fade show responsive-modal"
          style={{ display: "block" }}
          tabIndex="-1"
          aria-labelledby="modalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="modalLabel">
                  UPDATE CLIENT
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-6 mb-3">
                    <label htmlFor="clientName" className="form-label">
                      CLIENT NAME
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="clientName"
                      name="WhaClientName"
                      value={currentClient.WhaClientName}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-6 mb-3">
                    <label htmlFor="adminName" className="form-label">
                      ADMIN NAME
                    </label>
                    <select
                      className="form-select"
                      id="Adminname"
                      name="Adminname"
                      value={currentClient.Adminname}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Admin</option>
                      {adminName.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.AdminName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="col-6 mb-3">
                    <label htmlFor="whatsappCount" className="form-label">
                      TOTAL BALANCE
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="whatsappCount"
                      name="WhaCount"
                      value={parseFloat(currentClient.WhaCount)}
                      onChange={handleInputChange}
                      readOnly
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label
                      htmlFor="whatsappBalanceCount"
                      className="form-label"
                    >
                      BALANCE
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="whatsappBalanceCount"
                      name="WhaBalCount"
                      value={parseFloat(currentClient.WhaBalCount)}
                      onChange={handleInputChange}
                      readOnly
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-4 mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="isAdmin"
                      name="IsAdmin"
                      checked={currentClient.IsAdmin}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="isAdmin">
                      ADMIN
                    </label>
                  </div>
                  <div className="col-4 mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="isActive"
                      name="IsActive"
                      checked={currentClient.IsActive}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="isActive">
                      ACTIVE
                    </label>
                  </div>
                  <div className="col-4 mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="isOwnWhatsapp"
                      name="IsOWNWhatsapp"
                      checked={currentClient.IsOWNWhatsapp}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="isOwnWhatsapp">
                      OWN WHATSAPP
                    </label>
                  </div>
                </div>

                <div className="row">
                  <div className="col-6 mb-3">
                    <label htmlFor="userName" className="form-label">
                      USERNAME
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="userName"
                      name="UserName"
                      value={currentClient.UserName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label htmlFor="password" className="form-label">
                      PASSWORD
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="password"
                      name="Password"
                      value={currentClient.Password}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-6 mb-3">
                    <label htmlFor="database" className="form-label">
                      DATABASE
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="database"
                      name="Database"
                      value={currentClient.Database}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label htmlFor="port" className="form-label">
                      PORT
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="port"
                      name="Port"
                      value={currentClient.Port}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-6 mb-3">
                    <label htmlFor="staticIP" className="form-label">
                      STATIC IP
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="staticIP"
                      name="StaticIP"
                      value={currentClient.StaticIP}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label htmlFor="FolderName" className="form-label">
                      FolderName
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="FolderName"
                      name="FolderName"
                      value={currentClient.FolderName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-6 mb-3">
                    <label htmlFor="DocLink" className="form-label ">
                      Document Link Main Client
                    </label>
                    <select
                      id="DocLink"
                      name="DocLink"
                      className="form-select"
                      value={currentClient.DocLink?._id || ""}
                      onChange={handleInputChange}
                    >
                      <option value="">Select a client</option>
                      {WhaDocu.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.DocLinkName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-6 mb-3">
                    <label htmlFor="WhatsAppOffcialWa" className="form-label ">
                      WP API Setup Client
                    </label>
                    <select
                      id="WhatsAppOffcialWa"
                      name="WhatsAppOffcialWa"
                      className="form-select"
                      value={currentClient.WhatsAppOffcialWa?._id || ""}
                      onChange={handleInputChange}
                    >
                      <option value="">Select a client</option>
                      {WhatClient.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.WhatsappOffcialName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* tepmlate update  */}

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="Templates" className="form-label fw-bold">
                      Templates
                    </label>
                    <div
                      className="border rounded p-2"
                      style={{ maxHeight: "150px", overflowY: "auto" }}
                    >
                      {templates.map((item) => {
                        // Ensure Templates is always an array
                        const templatesList = currentClient.Templates || [];

                        // Extract IDs from templatesList if it contains objects
                        const templateIds = templatesList.map((template) =>
                          typeof template === "object"
                            ? String(template._id)
                            : String(template)
                        );

                        // Check if the current item's ID is in the templateIds array
                        const isSelected = templateIds.includes(
                          String(item._id)
                        );
                        console.log(isSelected);

                        return (
                          <div key={item._id} className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id={`template-${item._id}`}
                              value={item._id}
                              checked={isSelected}
                              onChange={(e) => {
                                setCurrentClient((prevState) => {
                                  // Ensure Templates is always an array
                                  const prevTemplates =
                                    prevState.Templates || [];

                                  // Extract IDs from prevTemplates if it contains objects
                                  const prevTemplateIds = prevTemplates.map(
                                    (template) =>
                                      typeof template === "object"
                                        ? String(template._id)
                                        : String(template)
                                  );

                                  const updatedTemplates = e.target.checked
                                    ? [...prevTemplateIds, item._id] // Add ID if checked
                                    : prevTemplateIds.filter(
                                        (id) => String(id) !== String(item._id)
                                      ); // Remove ID if unchecked

                                  return {
                                    ...prevState,
                                    Templates: [...new Set(updatedTemplates)], // Avoid duplicates
                                  };
                                });
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`template-${item._id}`}
                            >
                              {item.FormatID}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  CLOSE
                </button>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={updateClient}
                >
                  UPDATE
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

export default View_Client;
