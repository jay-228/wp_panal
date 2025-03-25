import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Admin.css";

const API_URL = "http://147.93.107.44:5000";

const Add_Admin = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required."),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Please enter a valid 10-digit phone number.")
        .required("Phone number is required."),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters.")
        .required("Password is required."),
    }),
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const response = await axios.post(`${API_URL}/register`, {
          AdminName: values.name,
          PhoneNumber: values.phone,
          Password: values.password,
        });
        formik.resetForm();
        console.log(response.data.message);
        toast.success("Admin added successfully!", {
          position: "top-right",
          autoClose: 1000,
          closeOnClick: false,
        });
      } catch (error) {
        console.error("There was an error:", error.response?.data?.message);
        setFieldError(
          "general",
          error.response?.data?.message || "An error occurred."
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
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
              className="rounded-2 m-0 px-5 text-white"
              style={{ backgroundColor: "black" }}
            >
              Add Admin
            </h3>
          </div>
        </div>
      </div>

      <div className="container mt-5 d-flex justify-content-center">
        <form
          onSubmit={formik.handleSubmit}
          className=" p-4 shadow rounded" // Added shadow and rounded classes
          style={{width: "400px", background:"#F8F9FA"}} 
        >
          {formik.errors.general && (
            <div className="alert alert-danger mb-3">
              {formik.errors.general}
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="name" className="form-label">
            <strong> Name</strong>
            </label>
            <input
              type="text"
              className={`form-control ${
                formik.touched.name && formik.errors.name ? "is-invalid" : ""
              }`}
              id="name"
              {...formik.getFieldProps("name")}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="invalid-feedback">{formik.errors.name}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="phone" className="form-label">
            <strong> Phone Number </strong>
            </label>
            <input
              type="text"
              className={`form-control ${
                formik.touched.phone && formik.errors.phone ? "is-invalid" : ""
              }`}
              id="phone"
              {...formik.getFieldProps("phone")}
            />
            {formik.touched.phone && formik.errors.phone && (
              <div className="invalid-feedback">{formik.errors.phone}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
            <strong>Password </strong>
            </label>
            <input
              type="password"
              className={`form-control ${
                formik.touched.password && formik.errors.password
                  ? "is-invalid"
                  : ""
              }`}
              id="password"
              {...formik.getFieldProps("password")}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="invalid-feedback">{formik.errors.password}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 rounded-2"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </>
  );
};

export default Add_Admin;