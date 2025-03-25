import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material";

const API_URL = "http://147.93.107.44:5000";

const Login_Page = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Validation schema with Yup
  const validationSchema = Yup.object({
    AdminName: Yup.string().required("Admin Name is required"),
    Password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // Handle form submission
  const handleSubmit = async (values) => {
    const { AdminName, Password } = values;

    try {
      const response = await axios.post(`${API_URL}/admin_login`, {
        AdminName,
        Password,
      });
      // Update the loading toast to a success message

      // Show a new success toast with a message
      toast.success("Admin Login successfully!", {
        position: "top-right",
        autoClose: 2000,
        closeOnClick: false,
      });

      // Store the token and navigate to the Dashboard after 2 seconds
      localStorage.setItem("authToken", JSON.stringify(response.data.token));
      localStorage.setItem("name", JSON.stringify(response.data.AdminName));

      setTimeout(() => {
        navigate("/Dashboard");
        window.location.reload();
      }, 1500); // 1500 milliseconds = 2 seconds
    } catch (error) {
      console.error(error);

      // Update the loading toast to an error message
      toast.error("Login failed! Admin Name or Password is incorrect!", {
        position: "top-right",
        autoClose: 2000,
        closeOnClick: false,
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card p-4 shadow-lg"
        style={{
          maxWidth: "450px",
          width: "100%",
          minHeight: "350px",
        }}
      >
        <div className="text-center mt-4">
          <img
            src={require("../Images/daynamic_logo.png")}
            alt="Logo"
            className="img-fluid"
            style={{ maxWidth: "80%" }}
          />
        </div>

        <Formik
          initialValues={{
            AdminName: "",
            Password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit} // Handle form submission with Axios
        >
          {() => (
            <Form className="mt-4">
              <label htmlFor="AdminName" className="form-label fw-bold">
                Admin Name:
              </label>
              <Field
                type="text"
                id="AdminName"
                name="AdminName"
                className="form-control mb-3 border-dark"
                placeholder="Enter Admin Name"
                style={{ width: "100%" }} // Inline style for width
              />
              <ErrorMessage
                name="AdminName"
                component="div"
                className="text-danger"
              />

              <label htmlFor="Password" className="form-label fw-bold  ">
                Password:
              </label>
              <div className="input-group w-100  mt-2">
                <Field
                  type={passwordVisible ? "text" : "password"}
                  id="Password"
                  name="Password"
                  className="form-control border-dark"
                  placeholder="Enter Password"
                />

                <button
                  className="input-group-text border-dark"
                  type="button"
                  onClick={togglePassword}
                  style={{ cursor: "pointer" }}
                >
                  <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
                  />
                  <i
                    className={`fa ${
                      passwordVisible ? "fa-eye-slash" : "fa-eye"
                    }`}
                  ></i>
                </button>
              </div>
              <ErrorMessage
                name="Password"
                component="div"
                className="text-danger"
              />

              <div className="text-center mt-4">
                <button type="submit" className="btn btn-primary w-100">
                  Login
                </button>
              </div>
            </Form>
          )}
        </Formik>

        {/* Toast Container */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default Login_Page;
