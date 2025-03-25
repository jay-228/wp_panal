import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Template.css";

const API_URL = "http://147.93.107.44:5000";

const View_Template = () => {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [searchFormatID, setSearchFormatID] = useState(""); // Input box for Format ID search
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page

  // Fetch templates from the API
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(`${API_URL}/template_view`);
        console.log("Full API Response:", response);

        if (Array.isArray(response.data)) {
          setTemplates(response.data);
        } else if (
          typeof response.data === "object" &&
          Array.isArray(response.data.templates)
        ) {
          setTemplates(response.data.templates);
        } else if (
          typeof response.data === "object" &&
          Array.isArray(response.data.data)
        ) {
          setTemplates(response.data.data);
        } else {
          console.error("Unexpected API response structure:", response.data);
          setError("Unexpected API response structure.");
          setTemplates([]);
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
        if (error.response) {
          console.error("Error response data:", error.response.data);
          console.error("Error response status:", error.response.status);
        }
        setError("Failed to fetch templates. Please try again later.");
        setTemplates([]);
      }
    };

    fetchTemplates();
  }, []);

  // Filter templates based on search query, selected template name, and Format ID search
  useEffect(() => {
    const filtered = templates.filter((template) => {
      // Extract FormatID and ensure it's a string
      const templateFormatID =
        typeof template.FormatID === "object" && template.FormatID !== null
          ? template.FormatID._id // If FormatID is an object, use its _id
          : template.FormatID || ""; // If FormatID is null/undefined, default to an empty string

      return (
        (searchQuery === "" ||
          template?.ClientID?.WhaClientName.toLowerCase().includes(
            searchQuery.toLowerCase()
          )) &&
        (selectedTemplateName === "" ||
          template?.TemplateName.toLowerCase().includes(
            selectedTemplateName.toLowerCase()
          )) &&
        (searchFormatID === "" ||
          String(templateFormatID)
            .toLowerCase()
            .includes(searchFormatID.toLowerCase()))
      );
    });

    setFilteredTemplates(filtered);
  }, [searchQuery, selectedTemplateName, searchFormatID, templates]);

  // Pagination logic
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTemplates = filteredTemplates.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Handle delete template
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this template?"
    );
    if (!isConfirmed) return;

    try {
      await axios.get(`${API_URL}/template_delete/${id}`);
      setTemplates(templates.filter((template) => template._id !== id));
      toast.success("Template deleted successfully!");
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error("Failed to delete template. Please try again later.");
    }
  };

  // Handle update template
  const handleUpdate = (template) => {
    setSelectedTemplate(template);
    setShowPopup(true);
  };

  // Handle form submission for updating template
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const { _id, FormatID, Script, TemplateName, TemplateJson } =
      selectedTemplate;

    try {
      await axios.put(`${API_URL}/template_update/${_id}`, {
        FormatID,
        Script,
        TemplateName,
        TemplateJson,
      });
      setTemplates(
        templates.map((template) =>
          template._id === _id ? selectedTemplate : template
        )
      );
      setShowPopup(false);
      toast.success("Template updated successfully!");
    } catch (error) {
      console.error("Error updating template:", error);
      toast.error("Failed to update template. Please try again later.");
    }
  };

  // Handle input change in the update form
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedTemplate((prevTemplate) => ({
      ...prevTemplate,
      [name]: value,
    }));
  };

  // Create a unique list of template names
  const uniqueTemplateNames = Array.from(
    new Set(templates.map((template) => template.TemplateName))
  );

  // Handle "View All Templates" button click
  const handleViewAllTemplates = () => {
    setSearchQuery("");
    setSelectedTemplateName("");
    setSearchFormatID("");
    setCurrentPage(1);
  };

  return (
    <div>
      <ToastContainer />
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
              View Template
            </h3>
          </div>
        </div>
      </div>

      <div className="container-fluid py-4">
        <div className="row g-3 align-items-center mb-4">
          <div className="col-auto">
            <label htmlFor="searchFormatID" className="form-label fw-bold mb-0">
              Search Format ID
            </label>
          </div>
          <div className="col-auto">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                id="searchFormatID"
                placeholder="Enter Format ID"
                value={searchFormatID}
                onChange={(e) => setSearchFormatID(e.target.value)}
                style={{
                  width: "250px",
                  "@media (max-width: 768px)": { width: "200px" },
                  "@media (max-width: 480px)": { width: "150px" },
                }}
              />
            </div>
          </div>
          <div className="col-auto">
            <label
              htmlFor="searchTemplateName"
              className="form-label fw-bold mb-0"
            >
              Search Template Name
            </label>
          </div>
          <div className="col-auto">
            <div className="input-group">
              <select
                className="form-select"
                id="searchTemplateName"
                value={selectedTemplateName}
                onChange={(e) => setSelectedTemplateName(e.target.value)}
                style={{
                  width: "250px",
                  "@media (max-width: 768px)": { width: "200px" },
                  "@media (max-width: 480px)": { width: "150px" },
                }}
              >
                <option value="">All Templates</option>
                {uniqueTemplateNames.map((name, index) => (
                  <option key={index} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-auto">
            <button
              className="btn btn-primary"
              onClick={handleViewAllTemplates}
            >
              <i className="bi bi-grid me-2"></i>
              View All Templates
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-primary text-center">
              <tr>
                <th>NO</th>
                <th>Format ID</th>
                <th>Script</th>
                <th>Template Name</th>
                <th>Template JSON</th>
                <th className="action-column">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentTemplates.length > 0 ? (
                currentTemplates.map((template, index) => (
                  <tr key={index}>
                    <td style={{ textAlign: "center" }}>
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td>
                      {typeof template.FormatID === "object"
                        ? template.FormatID._id
                        : template.FormatID}
                    </td>
                    <td
                      style={{
                        maxWidth: "300px",
                        whiteSpace: "pre-wrap",
                        wordWrap: "break-word",
                      }}
                    >
                      {template.Script}
                    </td>
                    <td>{template.TemplateName}</td>
                    <td
                      style={{
                        maxWidth: "300px",
                        whiteSpace: "pre-wrap",
                        wordWrap: "break-word",
                      }}
                    >
                      {template.TemplateJson}
                    </td>
                    <td className="text-center">
                      <div className="d-flex flex-column align-items-center">
                        <button
                          className="btn btn-warning btn-responsive mb-2 px-4 py-2"
                          onClick={() => handleUpdate(template)}
                        >
                          Update
                        </button>
                        <button
                          className="btn btn-danger btn-responsive px-4 py-2"
                          onClick={() => handleDelete(template._id)}
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
              <li className="page-item active">
                <a className="page-link" href="#">
                  {currentPage}
                </a>
              </li>

              {/* Ellipses before last page */}
              {currentPage <
                Math.ceil(filteredTemplates.length / itemsPerPage) - 2 && (
                <li className="page-item disabled">
                  <a className="page-link" href="#">
                    ...
                  </a>
                </li>
              )}

              {/* Show last page */}
              {currentPage <
                Math.ceil(filteredTemplates.length / itemsPerPage) - 1 && (
                <li
                  className="page-item"
                  onClick={() =>
                    paginate(Math.ceil(filteredTemplates.length / itemsPerPage))
                  }
                >
                  <a className="page-link" href="#">
                    {Math.ceil(filteredTemplates.length / itemsPerPage)}
                  </a>
                </li>
              )}

              <li
                className={`page-item ${
                  currentPage ===
                  Math.ceil(filteredTemplates.length / itemsPerPage)
                    ? "disabled"
                    : ""
                }`}
                onClick={() =>
                  currentPage <
                    Math.ceil(filteredTemplates.length / itemsPerPage) &&
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

      {/* Update Template Popup */}
      {showPopup && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ display: "block", paddingRight: "17px" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Template Data</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowPopup(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleFormSubmit}>
                  <div className="form-group mt-2">
                    <label>Format ID</label>
                    <input
                      type="text"
                      name="FormatID"
                      value={
                        typeof selectedTemplate.FormatID === "object"
                          ? selectedTemplate.FormatID._id
                          : selectedTemplate.FormatID
                      }
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group mt-2">
                    <label>Script</label>
                    <textarea
                      name="Script"
                      value={selectedTemplate.Script}
                      onChange={handleInputChange}
                      className="form-control"
                      rows={4}
                      style={{ width: "100%", resize: "vertical" }}
                    />
                  </div>
                  <div className="form-group mt-2">
                    <label>Template Name</label>
                    <input
                      type="text"
                      name="TemplateName"
                      value={selectedTemplate.TemplateName}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group mt-2">
                    <label>Template JSON</label>
                    <textarea
                      name="TemplateJson"
                      value={selectedTemplate.TemplateJson}
                      onChange={handleInputChange}
                      className="form-control"
                      rows={6}
                      style={{ width: "100%", resize: "vertical" }}
                    />
                  </div>
                  <div className="modal-footer mt-2">
                    <button
                      type="button"
                      className="btn btn-secondary ms-2"
                      onClick={() => setShowPopup(false)}
                    >
                      Cancel
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
  );
};

export default View_Template;
