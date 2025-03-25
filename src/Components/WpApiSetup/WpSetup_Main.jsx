import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://147.93.107.44:5000";

const WpSetup_Main = () => {
  const initialValues = {
    WhatsappOffcialName: "",
    OwnerNumber: "",
    Token: "",
    ApiURL: "",
    ApiVersion: "",
    WABAID: "",
    PhoneNumberID: "",
    SuccessKey: "",
  };

  const validationSchema = Yup.object({
    WhatsappOffcialName: Yup.string().required(
      "Whatsapp Official Name is required"
    ),
    OwnerNumber: Yup.string().required("Owner Number is required"),
    Token: Yup.string().required("Token is required"),
    ApiURL: Yup.string()
      .url("Invalid URL format")
      .required("API URL is required"),
    ApiVersion: Yup.string().required("API Version is required"),
    WABAID: Yup.string().required("WABA ID is required"),
    PhoneNumberID: Yup.string().required("Phone number is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await axios.post(`${API_URL}/wha_offcialwa_add`, values);
      console.log("Data submitted successfully:", response.data);
      toast.success("Data submitted successfully!");
      resetForm();
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Error submitting data!");
    }
  };

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
              WhatsApp API Setup
            </h3>
          </div>
        </div>
      </div>

      <div
        className="d-flex justify-content-center align-items-center shadow p-4 rounded mt-5"
        style={{ maxWidth: "900px", background: "#F8F9FA", margin: "auto" }}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form style={{ width: "90%", maxWidth: "900px" }}>
            <div className="row">
              <div className="col-md-6 mb-2">
                <label
                  htmlFor="WhatsappOffcialName"
                  className="form-label fw-bold"
                >
                  WhatsApp Official Name
                </label>
                <Field
                  type="text"
                  id="WhatsappOffcialName"
                  name="WhatsappOffcialName"
                  className="form-control"
                  style={{ width: "350px" }}
                />
                <ErrorMessage
                  name="WhatsappOffcialName"
                  component="div"
                  className="text-danger"
                />
              </div>
              <div className="col-md-6 mb-2">
                <label htmlFor="OwnerNumber" className="form-label fw-bold">
                  Owner Number
                </label>
                <Field
                  type="text"
                  id="OwnerNumber"
                  name="OwnerNumber"
                  className="form-control"
                  style={{ width: "350px" }}
                />
                <ErrorMessage
                  name="OwnerNumber"
                  component="div"
                  className="text-danger"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-2">
                <label htmlFor="Token" className="form-label fw-bold">
                  Token
                </label>
                <Field
                  type="text"
                  id="Token"
                  name="Token"
                  className="form-control"
                  style={{ width: "350px" }}
                />
                <ErrorMessage
                  name="Token"
                  component="div"
                  className="text-danger"
                />
              </div>
              <div className="col-md-6 mb-2">
                <label htmlFor="ApiURL" className="form-label fw-bold">
                  API URL
                </label>
                <Field
                  type="text"
                  id="ApiURL"
                  name="ApiURL"
                  className="form-control"
                  style={{ width: "350px" }}
                />
                <ErrorMessage
                  name="ApiURL"
                  component="div"
                  className="text-danger"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-2">
                <label htmlFor="ApiVersion" className="form-label fw-bold">
                  API Version
                </label>
                <Field
                  type="text"
                  id="ApiVersion"
                  name="ApiVersion"
                  className="form-control"
                  style={{ width: "350px" }}
                />
                <ErrorMessage
                  name="ApiVersion"
                  component="div"
                  className="text-danger"
                />
              </div>
              <div className="col-md-6 mb-2">
                <label htmlFor="WABAID" className="form-label fw-bold">
                  WABA ID
                </label>
                <Field
                  type="text"
                  id="WABAID"
                  name="WABAID"
                  className="form-control"
                  style={{ width: "350px" }}
                />
                <ErrorMessage
                  name="WABAID"
                  component="div"
                  className="text-danger"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-2">
                <label htmlFor="PhoneNumberID" className="form-label fw-bold">
                  Phone Number
                </label>
                <Field
                  type="text"
                  id="PhoneNumberID"
                  name="PhoneNumberID"
                  className="form-control"
                  style={{ width: "350px" }}
                />
                <ErrorMessage
                  name="PhoneNumberID"
                  component="div"
                  className="text-danger"
                />
              </div>
              <div className="col-md-6 mb-2">
                <label htmlFor="SuccessKey" className="form-label fw-bold">
                  Success Key
                </label>
                <Field
                  type="text"
                  id="SuccessKey"
                  name="SuccessKey"
                  className="form-control"
                  style={{ width: "350px" }}
                />
                <ErrorMessage
                  name="SuccessKey"
                  component="div"
                  className="text-danger"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary mt-3 d-block mx-auto"
              style={{ width: "350px" }}
            >
              Submit
            </button>
          </Form>
        </Formik>
      </div>
      <ToastContainer />
    </div>
  );
};

export default WpSetup_Main;
