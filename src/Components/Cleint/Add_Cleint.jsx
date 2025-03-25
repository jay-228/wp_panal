import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Cleint.css";

const API_URL = "http://147.93.107.44:5000";

const Add_Client = () => {
  const [adminName, setAdminNames] = useState([]);
  const [clientNames, setClientNames] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [WhatClient, setWhatClient] = useState([]);
  const [WhaDocu, setWhaDocu] = useState([]);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  // Fetch admin names, client names, and templates on component mount
  useEffect(() => {
    axios
      .get(`${API_URL}/wha_doclink_view_All`)
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          setWhaDocu(response.data.data);
        } else {
          console.error("Expected an array but received:", response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data!");
      });

    axios
      .get(`${API_URL}/admin_view`)
      .then((response) => {
        console.log("API Response:", response.data);
        setAdminNames(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching admin names:", error);
        setAdminNames([]);
      });

    axios
      .get(`${API_URL}/wha_offcialwa_view_All`)
      .then((res) => {
        setWhatClient(res.data.data);
      })
      .catch((error) => {
        toast.error("Error fetching data");
      });

    axios
      .get(`${API_URL}/client_view_All`)
      .then((response) => {
        console.log("API Response:", response.data);
        setClientNames(response.data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching client names:", error);
        toast.error("Error fetching client names!");
      });

    axios
      .get(`${API_URL}/template_view`)
      .then((response) => {
        console.log("API Response:", response.data);
        const uniqueTemplates = Array.from(
          new Set(response.data.data.map((item) => item._id)) // Use _id instead of FormatID
        ).map((id) => {
          return response.data.data.find((item) => item._id === id);
        });
        console.log("Unique Templates:", uniqueTemplates);
        setTemplates(uniqueTemplates || []);
      })
      .catch((error) => {
        console.error("Error fetching templates:", error);
        toast.error("Error fetching templates!");
      });
  }, []);

  // Formik configuration
  const formik = useFormik({
    initialValues: {
      WhaClientName: "",
      WhaCount: 0,
      WhaBalCount: 0,
      Adminname: "",
      IsAdmin: false,
      IsActive: false,
      StaticIP: "",
      IsOWNWhatsapp: false,
      Database: "",
      Password: "",
      UserName: "",
      Port: "",
      FolderName: "",
      WhatsAppOffcialWa: "",
      DocLink: "",
      Templates: [], // Initialize as an empty array
    },

    validationSchema: Yup.object({
      WhaClientName: Yup.string().required("Client Name is required"),
      WhaCount: Yup.string().required("Whatsapp Count is required"),
      WhaBalCount: Yup.string().required("Whatsapp Balance Count is required"),
      Adminname: Yup.string().required("Admin Name is required"),
      UserName: Yup.string().required("Username is required"),
      Password: Yup.string().required("Password is required"),
      Database: Yup.string().required("Database is required"),
      Port: Yup.string().required("Port is required"),
      StaticIP: Yup.string().required("Static IP is required"),
      FolderName: Yup.string().required("FolderName is required"),
      WhatsAppOffcialWa: Yup.string().required("WP API Setup Client"),
      DocLink: Yup.string().required("Document Link Main Client"),
      Templates: Yup.array()
        .min(1, "At least one template is required")
        .required("Templates are required"),
    }),
    onSubmit: (values) => {
      if (!values.Adminname) {
        toast.error("Please select an admin");
        return;
      }

      console.log("Submitting values:", values);

      axios
        .post(`${API_URL}/client_add/${values.Adminname}`, values)
        .then((response) => {
          console.log("Client added successfully:", response);
          toast.success("Client added successfully");
          formik.resetForm();
        })
        .catch((error) => {
          console.error("Error adding client:", error);
          if (error.response) {
            toast.error(
              `Error ${error.response.status}: ${
                error.response.data?.message || "Internal Server Error"
              }`
            );
          } else {
            toast.error("Request failed. Please try again.");
          }
        });
    },
  });

  // Function to check API connection
  const handleApiCall = async () => {
    try {
      const { Port, UserName, Password, Database, StaticIP } = formik.values;

      if (!Port || !UserName || !Password || !Database || !StaticIP) {
        toast.error(
          "Please fill all required fields (Port, Username, Password, Database, StaticIP)"
        );
        return;
      }

      const payload = {
        Port: parseInt(Port),
        UserName,
        Password,
        Database,
        StaticIP,
      };

      const response = await axios.post(`${API_URL}/checkConnection`, payload);
      console.log("API Response:", response.data);
      toast.success("API call successful");
    } catch (error) {
      console.error("Error making API call:", error);

      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
        console.error("Headers:", error.response.headers);
        toast.error(
          `Error ${error.response.status}: ${
            error.response.data?.message || "Internal Server Error"
          }`
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("No response from server");
      } else {
        console.error("Request error:", error.message);
        toast.error("Request setup error");
      }
    }
  };

  return (
    <div>
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
        rel="stylesheet"
      />
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
              Add Client
            </h3>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center align-items-center mt-3">
        <form
          onSubmit={formik.handleSubmit}
          className="bg-light p-4 rounded shadow-sm"
          style={{ width: "100%", maxWidth: "600px" }}
        >
          {/* Client Name and Admin Name */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="WhaClientName" className="custom-label fw-bold">
                Client Name
              </label>
              <input
                type="text"
                className="form-control"
                id="WhaClientName"
                name="WhaClientName"
                value={formik.values.WhaClientName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.WhaClientName && formik.errors.WhaClientName ? (
                <div className="text-danger">{formik.errors.WhaClientName}</div>
              ) : null}
            </div>
            <div className="col-md-6">
              <label htmlFor="Adminname" className="custom-label fw-bold">
                Admin Name
              </label>
              <select
                className="form-select"
                id="Adminname"
                name="Adminname"
                value={formik.values.Adminname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">Select Admin</option>
                {adminName.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.AdminName}
                  </option>
                ))}
              </select>
              {formik.touched.Adminname && formik.errors.Adminname ? (
                <div className="text-danger">{formik.errors.Adminname}</div>
              ) : null}
            </div>
          </div>

          {/* WhatsAppOffcialWa and DocLink */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="WhatsAppOffcialWa" className="form-label fw-bold">
                WP API Setup Client
              </label>
              <select
                id="WhatsAppOffcialWa"
                name="WhatsAppOffcialWa"
                className="form-select"
                value={formik.values.WhatsAppOffcialWa}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">Select a client</option>
                {WhatClient.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.WhatsappOffcialName}
                  </option>
                ))}
              </select>
              {formik.touched.WhatsAppOffcialWa &&
              formik.errors.WhatsAppOffcialWa ? (
                <div className="text-danger">
                  {formik.errors.WhatsAppOffcialWa}
                </div>
              ) : null}
            </div>
            <div className="col-md-6">
              <label htmlFor="DocLink" className="form-label fw-bold">
                Document Link Main Client
              </label>
              <select
                id="DocLink"
                name="DocLink"
                className="form-select"
                value={formik.values.DocLink}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">Select a client</option>
                {WhaDocu.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.DocLinkName}
                  </option>
                ))}
              </select>
              {formik.touched.DocLink && formik.errors.DocLink ? (
                <div className="text-danger">{formik.errors.DocLink}</div>
              ) : null}
            </div>
          </div>











          

          {/* Templates */}
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
                  const isSelected = formik.values.Templates.includes(item._id);
                  return (
                    <div key={item._id} className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`template-${item._id}`}
                        value={item._id}
                        checked={isSelected}
                        onChange={(e) => {
                          let updatedTemplates = [...formik.values.Templates];

                          if (e.target.checked) {
                            // FormatID के हिसाब से सारे matching templates लाना
                            const matchingTemplates = templates
                              .filter((t) => t.FormatID === item.FormatID)
                              .map((t) => t._id);

                            updatedTemplates = [
                              ...new Set([
                                ...updatedTemplates,
                                ...matchingTemplates,
                              ]),
                            ];
                          } else {
                            // Uncheck करने पर remove करना
                            updatedTemplates = updatedTemplates.filter(
                              (id) => id !== item._id
                            );
                          }

                          formik.setFieldValue("Templates", updatedTemplates);
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
              {formik.touched.Templates && formik.errors.Templates ? (
                <div className="text-danger">{formik.errors.Templates}</div>
              ) : null}
            </div>
          </div>







































          {/* WhaCount and WhaBalCount */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="WhaCount" className="custom-label fw-bold">
                Total Count
              </label>
              <input
                type="text"
                className="form-control"
                id="WhaCount"
                name="WhaCount"
                value={formik.values.WhaCount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                readOnly
              />
              {formik.touched.WhaCount && formik.errors.WhaCount ? (
                <div className="text-danger">{formik.errors.WhaCount}</div>
              ) : null}
            </div>
            <div className="col-md-6">
              <label htmlFor="WhaBalCount" className="custom-label fw-bold">
                Balance
              </label>
              <input
                type="text"
                className="form-control"
                id="WhaBalCount"
                name="WhaBalCount"
                value={formik.values.WhaBalCount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                readOnly
              />
              {formik.touched.WhaBalCount && formik.errors.WhaBalCount ? (
                <div className="text-danger">{formik.errors.WhaBalCount}</div>
              ) : null}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="row mb-3">
            <div className="col-md-4">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="IsAdmin"
                  name="IsAdmin"
                  checked={formik.values.IsAdmin}
                  onChange={formik.handleChange}
                />
                <label className="form-check-label fw-bold" htmlFor="IsAdmin">
                  Is Admin
                </label>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="IsActive"
                  name="IsActive"
                  checked={formik.values.IsActive}
                  onChange={formik.handleChange}
                />
                <label className="form-check-label fw-bold" htmlFor="IsActive">
                  Is Active
                </label>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="IsOWNWhatsapp"
                  name="IsOWNWhatsapp"
                  checked={formik.values.IsOWNWhatsapp}
                  onChange={formik.handleChange}
                />
                <label
                  className="form-check-label fw-bold"
                  htmlFor="IsOWNWhatsapp"
                >
                  Own WhatsApp
                </label>
              </div>
            </div>
          </div>

          {/* Username and Password */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="UserName" className="custom-label fw-bold">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="UserName"
                name="UserName"
                value={formik.values.UserName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.UserName && formik.errors.UserName ? (
                <div className="text-danger">{formik.errors.UserName}</div>
              ) : null}
            </div>

            <div className="col-md-6">
              <label htmlFor="Password" className="custom-label fw-bold">
                Password
              </label>
              <input
                type="text"
                className="form-control"
                id="Password"
                name="Password"
                value={formik.values.Password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.Password && formik.errors.Password ? (
                <div className="text-danger">{formik.errors.Password}</div>
              ) : null}
            </div>
          </div>

          {/* Database and Port */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="Database" className="custom-label fw-bold">
                Database
              </label>
              <input
                type="text"
                className="form-control"
                id="Database"
                name="Database"
                value={formik.values.Database}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.Database && formik.errors.Database ? (
                <div className="text-danger">{formik.errors.Database}</div>
              ) : null}
            </div>

            <div className="col-md-6">
              <label htmlFor="Port" className="custom-label fw-bold">
                Port
              </label>
              <input
                type="number"
                className="form-control"
                id="Port"
                name="Port"
                value={formik.values.Port}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.Port && formik.errors.Port ? (
                <div className="text-danger">{formik.errors.Port}</div>
              ) : null}
            </div>
          </div>

          {/* Static IP and Folder Name */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="StaticIP" className="custom-label fw-bold">
                Static IP
              </label>
              <input
                type="text"
                className="form-control"
                id="StaticIP"
                name="StaticIP"
                value={formik.values.StaticIP}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.StaticIP && formik.errors.StaticIP ? (
                <div className="text-danger">{formik.errors.StaticIP}</div>
              ) : null}
            </div>
            <div className="col-md-6">
              <label htmlFor="FolderName" className="custom-label fw-bold">
                FolderName
              </label>
              <input
                type="text"
                className="form-control"
                id="FolderName"
                name="FolderName"
                value={formik.values.FolderName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.FolderName && formik.errors.FolderName ? (
                <div className="text-danger">{formik.errors.FolderName}</div>
              ) : null}
            </div>
          </div>

          {/* Buttons */}
          <button
            type="button"
            className="btn btn-secondary w-100 mt-3"
            onClick={handleApiCall}
          >
            Check Connection
          </button>
          <button type="submit" className="btn btn-primary w-100 mt-3">
            Submit
          </button>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Add_Client;
