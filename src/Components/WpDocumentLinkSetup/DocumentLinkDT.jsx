import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const API_URL = "http://147.93.107.44:5000";

// Form validation schema
const validationSchema = Yup.object({
  ClientName: Yup.string().required("Client Name is required"),
  DocHeaderName: Yup.string().required("Doc Header Name is required"),
  DocHeaderValue: Yup.string().required("Doc Header Value is required"),
});

const DocumentLinkDT = () => {
  const [DocLinkName, setDocLinkName] = useState([]);

  // Fetch data for the dropdown menu from the API
  useEffect(() => {
    axios
      .get(`${API_URL}/wha_doclink_view_All`)
      .then((response) => {
        console.log("API Response:", response.data);
        setDocLinkName(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching client names:", error);
        toast.error("Error fetching client names!");
      });
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    console.log("Submitting values:", values);

    try {
      const response = await axios.post(
        `${API_URL}/wha_doclinkdt_add/${values.ClientName}`,
        values
      );
      console.log("Data submitted successfully:", response.data);
      toast.success("Data submitted successfully!");

      // Reset the form fields
      resetForm();
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Error submitting data!");
    }
  };

  return (
    <div>
      <ToastContainer />
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
              Document Link Details
            </h3>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="container mt-4 d-flex justify-content-center">
        <Formik
          initialValues={{
            ClientName: "",
            DocHeaderName: "",
            DocHeaderValue: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form
              className="p-4 border rounded bg-light"
              style={{ width: "380px", background: "#F8F9FA" }}
            >
              <div className="mb-3">
                <label htmlFor="ClientName" className="form-label fw-bold">
                  Document Link Name Option
                </label>
                <Field
                  as="select"
                  id="ClientName"
                  name="ClientName"
                  className="form-select"
                >
                  <option value="">Select Name</option>
                  {DocLinkName.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.DocLinkName}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="ClientName"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="DocHeaderName" className="form-label fw-bold">
                  Document Header Name
                </label>
                <Field
                  id="DocHeaderName"
                  name="DocHeaderName"
                  type="text"
                  className="form-control"
                />
                <ErrorMessage
                  name="DocHeaderName"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="DocHeaderValue" className="form-label fw-bold">
                  Document Header Value
                </label>
                <Field
                  id="DocHeaderValue"
                  name="DocHeaderValue"
                  type="text"
                  className="form-control"
                />
                <ErrorMessage
                  name="DocHeaderValue"
                  component="div"
                  className="text-danger"
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default DocumentLinkDT;
