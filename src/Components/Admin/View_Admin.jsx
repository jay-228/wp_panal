import React, { useState, useEffect } from "react";
import axios from "axios";
import bcrypt from "bcryptjs";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Admin.css"; // Import external CSS file for media queries

const API_URL = "http://147.93.107.44:5000";

const View_Admin = () => {
  const [adminData, setAdminData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page

  // Fetch admin data from the API
  const viewData = () => {
    axios
      .get(`${API_URL}/admin_view`)
      .then((res) => {
        setAdminData(res.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
        toast.error("Failed to load admin data");
      });
  };

  // Fetch data on component mount
  useEffect(() => {
    viewData();
  }, []);

  // Delete an admin
  const deleteAdmin = (id) => {
    if (window.confirm("Are you sure you want to delete this Admin?")) {
      axios
        .get(`${API_URL}/admin_delete/${id}`)
        .then(() => {
          toast.success("Admin deleted successfully");
          setAdminData(adminData.filter((admin) => admin._id !== id));
        })
        .catch(() => {
          toast.error("Failed to delete admin");
        });
    }
  };

  // Set the admin data to be edited
  const handleEdit = (admin) => {
    setEditData(admin);
  };

  // Update admin data
  const handleUpdate = async (e) => {
    e.preventDefault();
    const hashedPassword = await bcrypt.hash(editData.Password, 10);
    const updatedData = { ...editData, Password: hashedPassword };

    axios
      .put(`${API_URL}/admin_update/${editData._id}`, updatedData)
      .then(() => {
        toast.success("Admin updated successfully");
        setEditData(null);
        viewData();
      })
      .catch(() => {
        toast.error("Failed to update admin");
      });
  };

  // Filter admin data based on search term
  const filteredAdminData = adminData.filter((admin) =>
    admin.AdminName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAdminData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Change page
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
              className="rounded-2 m-0 px-5 text-white"
              style={{ backgroundColor: "black" }}
            >
              View Admin
            </h3>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="container mt-4" style={{ maxWidth: "1000px" }}>
        {/* Search Bar with Label in One Line */}
        <div className="d-flex align-items-center mb-3">
          <label htmlFor="searchAdmin" className="form-label me-2 mb-0 fw-bold">
            Search Admin:
          </label>
          <div className="input-group" style={{ width: "250px" }}>
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              id="searchAdmin"
              className="form-control"
              placeholder="Search by Admin Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "200px" }} // Set width to 200px
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-primary text-center">
              <tr>
                <th>NO</th>
                <th>Name</th>
                <th>Phone Number</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <tr key={item._id} className="text-start align-middle">
                    <td style={{ textAlign: "center" }}>
                      {indexOfFirstItem + index + 1}    
                    </td>
                    <td>{item.AdminName}</td>
                    <td>{item.PhoneNumber}</td>
                    <td className="d-flex justify-content-center flex-wrap gap-2">
                      <button
                        className="btn btn-warning"
                        onClick={() => handleEdit(item)}
                      >
                        Update
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => deleteAdmin(item._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
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
                Math.ceil(filteredAdminData.length / itemsPerPage) - 2 && (
                <li className="page-item disabled">
                  <a className="page-link" href="#">
                    ...
                  </a>
                </li>
              )}

              {/* Show last page */}
              {currentPage <
                Math.ceil(filteredAdminData.length / itemsPerPage) - 1 && (
                <li
                  className="page-item"
                  onClick={() =>
                    paginate(Math.ceil(filteredAdminData.length / itemsPerPage))
                  }
                >
                  <a className="page-link" href="#">
                    {Math.ceil(filteredAdminData.length / itemsPerPage)}
                  </a>
                </li>
              )}

              <li
                className={`page-item ${
                  currentPage ===
                  Math.ceil(filteredAdminData.length / itemsPerPage)
                    ? "disabled"
                    : ""
                }`}
                onClick={() =>
                  currentPage <
                    Math.ceil(filteredAdminData.length / itemsPerPage) &&
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

      {/* Edit Modal Section */}
      {editData && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            position: "fixed",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1050,
          }}
          tabIndex="-1"
          aria-labelledby="updateAdminLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="updateAdminLabel">
                  Update Admin
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditData(null)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editData.AdminName}
                    onChange={(e) =>
                      setEditData({ ...editData, AdminName: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editData.PhoneNumber}
                    onChange={(e) =>
                      setEditData({ ...editData, PhoneNumber: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editData.Password}
                    onChange={(e) =>
                      setEditData({ ...editData, Password: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditData(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
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

      {/* Toast Container for Notifications */}
      <ToastContainer />
    </>
  );
};

export default View_Admin;
