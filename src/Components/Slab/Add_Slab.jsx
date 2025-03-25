import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://147.93.107.44:5000";

const Add_Slab = () => {
  const formik = useFormik({
    initialValues: {
      WhaSlabName: "",
      WhaWEF: "",
    },
    validationSchema: Yup.object({
      WhaSlabName: Yup.string().required("Slab Name is required."),
      WhaWEF: Yup.date().required("Effective Date is required."),
    }),
    onSubmit: async (values, { setSubmitting, setFieldError, resetForm }) => {
      try {
        // Append the current time to the selected date
        const selectedDate = new Date(values.WhaWEF);
        const currentTime = new Date();
    
        // Set the time part of the selected date to the current time
        selectedDate.setHours(currentTime.getHours());
        selectedDate.setMinutes(currentTime.getMinutes());
        selectedDate.setSeconds(currentTime.getSeconds());
    
        // Format the date and time in the desired format "YYYY-MM-DD HH:mm:ss"
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
        const day = String(selectedDate.getDate()).padStart(2, "0");
        const hours = String(selectedDate.getHours()).padStart(2, "0");
        const minutes = String(selectedDate.getMinutes()).padStart(2, "0");
        const seconds = String(selectedDate.getSeconds()).padStart(2, "0");
    
        // Combine date and time in the format "YYYY-MM-DD HH:mm:ss"
        values.WhaWEF = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    
        const response = await axios.post(`${API_URL}/slab_add`, values);
        toast.success("Slab added successfully!");
        resetForm();
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred.");
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
              className="rounded-2 m-0 px-5 text-white uppercase"
              style={{ backgroundColor: "black" }}
            >
              Add Slab
            </h3>
          </div>
        </div>
      </div>

      <div className="container mt-5 d-flex justify-content-center">
        <form
          onSubmit={formik.handleSubmit}
          style={{ width: "380px", background: "#F8F9FA" }}
          className=" p-4 shadow rounded"
        >
          {formik.errors.general && (
            <div className="text-danger mb-3">{formik.errors.general}</div>
          )}

          <div className="mb-3">
            <label htmlFor="WhaSlabName" className="form-label fw-bold" >
              Slab Name
            </label>
            <input
              type="text"
              className={`form-control ${
                formik.touched.WhaSlabName && formik.errors.WhaSlabName
                  ? "is-invalid"
                  : ""
              }`}
              id="WhaSlabName"
              {...formik.getFieldProps("WhaSlabName")}
            />
            {formik.touched.WhaSlabName && formik.errors.WhaSlabName && (
              <div className="invalid-feedback">
                {formik.errors.WhaSlabName}
              </div>
            )}
          </div>
            
          <div className="mb-3">
            <label htmlFor="WhaWEF" className="form-label fw-bold">
              Effective Date
            </label>
            <input
              type="date"
              className={`form-control ${
                formik.touched.WhaWEF && formik.errors.WhaWEF
                  ? "is-invalid"
                  : ""
              }`}
              id="WhaWEF"
              {...formik.getFieldProps("WhaWEF")}
            />
            {formik.touched.WhaWEF && formik.errors.WhaWEF && (
              <div className="invalid-feedback">{formik.errors.WhaWEF}</div>
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

export default Add_Slab;
