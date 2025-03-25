import React, { useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://147.93.107.44:5000";

const DocumentLink_main = () => {
  const initialValues = {
    DocLinkName: "",
    WHADOcLinkURL: "",
    WHADOcURLKey: "",
  };

  const validationSchema = Yup.object().shape({
    DocLinkName: Yup.string().required("URL name is required"),
    WHADOcLinkURL: Yup.string().required("URL is required"),
    WHADOcURLKey: Yup.string().required("Key is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    console.log("Submitting values:", values);
    try {
      const response = await axios.post(`${API_URL}/wha_doclink_add`, values);
      console.log("Data submitted successfully:", response.data);
      toast.success("Data submitted successfully!");
      resetForm(); // Clear form fields after successful submission
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Error submitting data!");
    }
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
              className="rounded-2 m-0 px-5 text-white uppercase"
              style={{ backgroundColor: "black" }}
            >
              Document Link Main
            </h3>
          </div>
        </div>
      </div>
      <div className="container mt-4 d-flex justify-content-center">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ resetForm }) => (
            <Form
              className="p-4 border rounded bg-light"
              style={{ width: "380px", background: "#F8F9FA" }}
            >
              <div className="mb-3">
                <label htmlFor="DocLinkName" className="form-label fw-bold">
                  Document Link Name
                </label>
                <Field
                  type="text"
                  id="DocLinkName"
                  name="DocLinkName"
                  className="form-control"
                />
                <ErrorMessage
                  name="DocLinkName"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="WHADOcLinkURL" className="form-label fw-bold">
                  Document Link URL
                </label>
                <Field
                  type="text"
                  id="WHADOcLinkURL"
                  name="WHADOcLinkURL"
                  className="form-control"
                />
                <ErrorMessage
                  name="WHADOcLinkURL"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="WHADOcURLKey" className="form-label fw-bold">
                  Document URL Key
                </label>
                <Field
                  type="text"
                  id="WHADOcURLKey"
                  name="WHADOcURLKey"
                  className="form-control"
                />
                <ErrorMessage
                  name="WHADOcURLKey"
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

export default DocumentLink_main;
