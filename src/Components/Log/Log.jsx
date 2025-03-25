import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Button, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "react-bootstrap-icons";
import "./Log.css";
import { Filter } from "react-bootstrap-icons";
import "bootstrap-icons/font/bootstrap-icons.css";

const API_URL = "http://147.93.107.44:5000";

function Log() {
  const [logData, setLogData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    MobileUserName: "",
    WhaClientName: "",
    FMTID: "",
    UnqID: "",
    VoucherNo: "",
    IsSuccess: "",
    MobileNo: "",
    FirmName: "",
    ProjectName: "",
    StaticIP: "",
    DateFrom: null,
    DateTo: null,
  });
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4); // Number of items per page

  // Fetch data from the API
  useEffect(() => {
    axios
      .get(`${API_URL}/log_All_view`)
      .then((res) => {
        setLogData(res.data.data);
        setFilteredData(res.data.data);
        console.log("API Response:", res.data.data); // Debugging
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  }, []);

  // Helper function to get unique values for filters
  const uniqueValues = (key) => {
    if (key === "WhaClientName") {
      // Extract unique client names from the nested ClientID object
      return [
        ...new Set(logData.map((item) => item.ClientID?.WhaClientName)),
      ].filter(Boolean);
    } else {
      // For other fields, use the existing logic
      return [...new Set(logData.map((item) => item[key]))].filter(Boolean);
    }
  };

  const uniqueValues1 = (key) => {
    if (key === "WhaClientName") {
      // Extract unique client names from the nested ClientID object
      return [
        ...new Set(logData.map((item) => item.ClientID?.WhaClientName)),
      ].filter(Boolean);
    } else if (key === "VoucherNo") {
      // Extract unique voucher numbers
      return [...new Set(logData.map((item) => item.UnqVnos))].filter(Boolean);
    } else {
      // For other fields, use the existing logic
      return [...new Set(logData.map((item) => item[key]))].filter(Boolean);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      MobileUserName: "",
      WhaClientName: "",
      FMTID: "",
      UnqID: "",
      VoucherNo: "",
      IsSuccess: "",
      MobileNo: "",
      FirmName: "",
      ProjectName: "",
      StaticIP: "",
      DateFrom: null,
      DateTo: null,
    });
  };

  // Mapping for filter labels
  const labelMapping = {
    MobileUserName: "Mobile User Name",
    WhaClientName: "Client Name",
    FMTID: "FMT ID",
    UnqID: "Unique ID",
    VoucherNo: "Voucher Number",
    IsSuccess: "Success",
    MobileNo: "Mobile Number",
    FirmName: "Firm Name",
    ProjectName: "Project Name",
    StaticIP: "Static IP",
    DateFrom: "From Date",
    DateTo: "To Date",
  };

  // Apply filters to the data
  useEffect(() => {
    if (!Array.isArray(logData)) return;

    let filtered = logData.filter((item) => {
      const itemDate = new Date(item.WhaSendDatetime); // Ensure WhaSendDatetime is a valid date

      // Adjust DateTo to include the entire selected day
      const dateTo = filters.DateTo ? new Date(filters.DateTo) : null;
      if (dateTo) {
        dateTo.setHours(23, 59, 59, 999); // Set to the end of the day
      }

      return (
        (!filters.MobileUserName ||
          item.MobileUserName === filters.MobileUserName) &&
        (!filters.WhaClientName ||
          item.ClientID?.WhaClientName === filters.WhaClientName) &&
        (!filters.UnqID ||
          item.UnqID?.toString() === filters.UnqID.toString()) &&
        (!filters.FMTID || item.FMTID === filters.FMTID) &&
        (!filters.VoucherNo || item.UnqVnos === filters.VoucherNo) &&
        (!filters.IsSuccess ||
          item.IsSuccess.toString() === filters.IsSuccess) &&
        (!filters.MobileNo || item.MobileNo === filters.MobileNo) &&
        (!filters.FirmName || item.FirmName === filters.FirmName) &&
        (!filters.ProjectName || item.ProjectName === filters.ProjectName) &&
        (!filters.StaticIP || item.StaticIP === filters.StaticIP) &&
        (!filters.DateFrom || itemDate >= new Date(filters.DateFrom)) &&
        (!dateTo || itemDate <= dateTo) // Use the adjusted dateTo
      );
    });

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to the first page when filters change
  }, [filters, logData]);

  // Custom input component for DatePicker with Bootstrap calendar icon
  const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
    <div className="input-group" style={{ width: "auto" }}>
      <input
        type="text"
        className="form-control"
        value={value}
        onClick={onClick}
        ref={ref}
        readOnly
        placeholder="Select date"
      />
      <div className="input-group-append" style={{ width: "auto" }}>
        <span className="input-group-text" onClick={onClick}>
          <Calendar /> {/* Bootstrap calendar icon */}
        </span>
      </div>
    </div>
  ));

  // Pagination logic
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
              Log Report
            </h3>
          </div>
        </div>
      </div>

      {/* Open Filters and Reset Filters Buttons */}
      <div className="d-flex gap-2 mt-3 m-2 justify-content-end">
        <Button
          className="d-flex align-items-center gap-2"
          variant="secondary"
          onClick={() => setShowModal(true)}
        >
          <Filter /> Open Filters
        </Button>
        <Button
          className="d-flex align-items-center gap-2"
          variant="primary"
          onClick={clearFilters} // Reset filters when clicked
        >
          <i className="bi bi-grid"></i>
          Show All Log
        </Button>
      </div>

      {/* Table Section */}
      <div className="table-responsive gg mt-3 ">
        {/* Filter Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title> Log Filter Options</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="container-fluid">
              <div className="row">
                {Object.keys(filters).map((key) => (
                  <div className="col-md-6 mb-3" key={key}>
                    <label className="form-label">{labelMapping[key]}</label>
                    {key === "DateFrom" || key === "DateTo" ? (
                      <DatePicker
                        selected={filters[key]}
                        onChange={(date) =>
                          setFilters({ ...filters, [key]: date })
                        }
                        customInput={<CustomDateInput />} // Use custom input with calendar icon
                        dateFormat="yyyy-MM-dd"
                        placeholderText={`Select ${labelMapping[key]}`}
                        isClearable
                      />
                    ) : (
                      <select
                        name={key}
                        className="form-select"
                        value={filters[key]}
                        onChange={handleFilterChange}
                      >
                        <option value="">All</option>
                        {key === "IsSuccess" ? (
                          <>
                            <option value="true">True</option>
                            <option value="false">False</option>
                          </>
                        ) : (
                          uniqueValues1(key).map((val, index) => (
                            <option key={index} value={val}>
                              {val}
                            </option>
                          ))
                        )}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="danger"
              onClick={() => {
                clearFilters();
                setShowModal(false);
              }}
            >
              Clear Filters
            </Button>
            <Button
              variant="primary"
              onClick={() => setShowModal(false)} // Close the modal and apply filters
            >
              Apply Filters
            </Button>
          </Modal.Footer>
        </Modal>

        <table className="table table-bordered table-hover ">
          <thead className="table-primary text-center">
            <tr>
              <th>No</th>
              <th>Client Name</th>
              <th>Unq ID</th>
              <th>FMT ID</th>
              <th>RestResponse</th>
              <th>Voucher No.</th>
              <th>Response</th>
              <th>Success</th>
              <th>Mobile No.</th>
              <th>StartFlag</th>
              <th>Mobile User Name</th>
              <th>Firm Name</th>
              <th>Project Name</th>
              <th>Static IP</th>
              <th>Time</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <tr key={index} className="text-center align-middle">
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{item.ClientID?.WhaClientName}</td>
                  <td>{item.UnqID}</td>
                  <td>{item.FMTID}</td>
                  <td>{item.RestResponse}</td>
                  <td>{item.UnqVnos}</td>
                  <td>{item.Response}</td>
                  <td>{item.IsSuccess ? "True" : "False"}</td>
                  <td>{item.MobileNo}</td>
                  <td>{item.StartFlag}</td>
                  <td>{item.MobileUserName}</td>
                  <td>{item.FirmName}</td>
                  <td>{item.ProjectName}</td>
                  <td>{item.StaticIP}</td>
                  <td>{item.WhaSendDatetime}</td>
                  <td>{item.Price}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="16" className="text-center text-danger fw-bold">
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
                currentPage === Math.ceil(filteredData.length / itemsPerPage)
                  ? "disabled"
                  : ""
              }`}
              onClick={() =>
                currentPage < Math.ceil(filteredData.length / itemsPerPage) &&
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
  );
}

export default Log;
