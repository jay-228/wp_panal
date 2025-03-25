import React, { useState, useEffect } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://147.93.107.44:5000";

const SlabDT = () => {
  const [whaSlabOptions, setWhaSlabOptions] = useState([]);
  const [selectedSlabID, setSelectedSlabID] = useState("");

  // Fetch options for the dropdown dynamically from the API
  useEffect(() => {
    axios
      .get(`${API_URL}/slab_view`) // Replace with your API endpoint
      .then((response) => {
        console.log("API Response:", response.data); // Debugging: Log the API response
        setWhaSlabOptions(response.data.data); // Assuming response.data is an array of options
      })
      .catch((error) => {
        console.error("Error fetching slab options:", error);
      });
  }, []);

  const formik = useFormik({
    initialValues: {
      whaSlabName: "",
      FromMSGToMSG: "",
      Price: "",
    },
    validationSchema: Yup.object({
      whaSlabName: Yup.string().required("Slab Name is required."),
      FromMSGToMSG: Yup.string()
        .required("Range is required.")
        .matches(/^\d+\s*-\s*\d+$/, "Range must be in the format 'X - Y'"),
      Price: Yup.number()
        .required("Price is required.")
        .positive("Price must be a positive number")
        .typeError("Price must be a valid number"),
    }),
    onSubmit: (values) => {
      const selectedSlab = whaSlabOptions.find(
        (option) => option.WhaSlabName === values.whaSlabName
      );

      if (selectedSlab) {
        const whaSlabID = selectedSlab._id; // Get the ID of the selected slab

        const dataToPost = {
          whaSlabID,
          FromMSGToMSG: values.FromMSGToMSG,
          Price: values.Price,
        };

        // Send the data to the API
        axios
          .post(`${API_URL}/slabdt_add/${whaSlabID}`, dataToPost)
          .then((response) => {
            toast.success("Form submitted successfully!");
            formik.resetForm();
          })
          .catch((error) => {
            toast.error("Error submitting the form!");
            console.error("Error submitting the form:", error);
          });
      } else {
        toast.error("Please select a valid slab name.");
      }
    },
  });

  const handleSlabNameChange = (event) => {
    const selectedName = event.target.value;
    const selectedSlab = whaSlabOptions.find(
      (option) => option.WhaSlabName === selectedName
    );

    if (selectedSlab) {
      setSelectedSlabID(selectedSlab._id); // Set the selected slab ID dynamically
    } else {
      setSelectedSlabID(""); // Reset the ID if no slab is selected
    }
  };

  return (
    <>
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
              Slab Detail
            </h3>
          </div>
        </div>
      </div>

      <div className="container mt-4 d-flex justify-content-center">
        <form
          onSubmit={formik.handleSubmit}
          style={{ width: "380px", background: "#F8F9FA" }}
          className=" p-4 shadow rounded"
        >
          {/* Slab Name */}
          <div className="mb-3">
            <label htmlFor="whaSlabName" className="form-label fw-bold">
              Slab Name
            </label>
            <select
              id="whaSlabName"
              name="whaSlabName"
              className={`form-select ${
                formik.touched.whaSlabName && formik.errors.whaSlabName
                  ? "is-invalid"
                  : ""
              }`}
              value={formik.values.whaSlabName}
              onChange={(e) => {
                formik.handleChange(e);
                handleSlabNameChange(e); // Update selected Slab ID dynamically
              }}
              onBlur={formik.handleBlur}
            >
              <option value="">Select Slab Name</option>
              {whaSlabOptions?.map((option) => (
                <option key={option.id} value={option.WhaSlabName}>
                  {option.WhaSlabName}
                </option>
              ))}
            </select>
            {formik.touched.whaSlabName && formik.errors.whaSlabName && (
              <div className="invalid-feedback">
                {formik.errors.whaSlabName}
              </div>
            )}
          </div>

          {/* Range */}
          <div className="mb-3">
            <label htmlFor="FromMSGToMSG" className="form-label fw-bold">
              Range
            </label>
            <input
              type="text"
              id="FromMSGToMSG"
              name="FromMSGToMSG"
              className={`form-control ${
                formik.touched.FromMSGToMSG && formik.errors.FromMSGToMSG
                  ? "is-invalid"
                  : ""
              }`}
              value={formik.values.FromMSGToMSG}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.FromMSGToMSG && formik.errors.FromMSGToMSG && (
              <div className="invalid-feedback">
                {formik.errors.FromMSGToMSG}
              </div>
            )}
          </div>

          {/* Price */}
          <div className="mb-3">
            <label htmlFor="Price" className="form-label fw-bold">
              Price
            </label>
            <input
              type="number"
              id="Price"
              name="Price"
              className={`form-control ${
                formik.touched.Price && formik.errors.Price ? "is-invalid" : ""
              }`}
              value={formik.values.Price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.Price && formik.errors.Price && (
              <div className="invalid-feedback">{formik.errors.Price}</div>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-100 rounded-2">
            Submit
          </button>
        </form>
      </div>

      <ToastContainer />
    </>
  );
};

export default SlabDT;
