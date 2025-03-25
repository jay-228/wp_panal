import React, { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS

const API_URL = "http://147.93.107.44:5000";

const Add_Template = () => {
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post(`${API_URL}/template_add`, values);
      console.log("Response:", response.data);
      toast.success("Template added successfully!");
      resetForm();
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
      toast.error("Failed to add template.");
    } finally {
      setSubmitting(false);
    }
  };

  // Define the validation schema using Yup
  const validationSchema = Yup.object().shape({
    FormatID: Yup.string().required("Format ID is required"),
    Script: Yup.string().required("Script is required"),
    TemplateName: Yup.string().required("Template Name is required"),
    TemplateJson: Yup.string().required("Template JSON is required"),
  });

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
              Template
            </h3>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="container mt-4 d-flex justify-content-center">
        <Formik
          initialValues={{
            FormatID: "",
            Script: "",
            TemplateName: "",
            TemplateJson: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form
              style={{ width: "380px", background: "#F8F9FA" }}
              className="p-4 shadow rounded"
            >
              <div className="mb-3">
                <label htmlFor="FormatID" className="form-label fw-bold">
                  Format ID
                </label>
                <Field
                  type="text"
                  className="form-control"
                  id="FormatID"
                  name="FormatID"
                  required
                />
                <ErrorMessage
                  name="FormatID"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="Script" className="form-label fw-bold">
                  Script
                </label>
                <Field
                  as="textarea"
                  className="form-control"
                  id="Script"
                  name="Script"
                  required
                />
                <ErrorMessage
                  name="Script"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="TemplateName" className="form-label fw-bold">
                  Template Name
                </label>
                <Field
                  type="text"
                  className="form-control"
                  id="TemplateName"
                  name="TemplateName"
                  required
                />
                <ErrorMessage
                  name="TemplateName"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="TemplateJson" className="form-label fw-bold">
                  Template JSON
                </label>
                <Field
                  as="textarea"
                  className="form-control"
                  id="TemplateJson"
                  name="TemplateJson"
                  required
                />
                <ErrorMessage
                  name="TemplateJson"
                  component="div"
                  className="text-danger"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 rounded-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </Form>
          )}
        </Formik>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Add_Template;
