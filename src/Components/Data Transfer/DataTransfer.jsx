import axios from "axios";
import { Field, Formik, Form } from "formik";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for toast notifications

const API_URL = "http://147.93.107.44:5000";

const DataTransfer = () => {
  const [clientNames, setClientNames] = useState([]);

  useEffect(() => {
    // Fetch clients on component mount
    axios
      .get(`${API_URL}/client_view_All`)

      
      .then((response) => {
        setClientNames(response.data.data);
        console.log("Fetched client names:", response.data.data);
      })
      .catch((error) => {
        toast.error("Error fetching client names!");
        console.error("Error fetching client names:", error);
      });
  }, []);

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
            Data Transfer
            </h3>
          </div>
        </div>
      </div>

      <Formik
        initialValues={{ ClientID: "" }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          const selectedClient = clientNames.find(
            (client) => client._id === values.ClientID
          );

          if (selectedClient) {
            const staticIP = selectedClient.StaticIP;

            toast
              .promise(axios.post(`${API_URL}/mongotosql/${staticIP}`), {
                pending: "Submitting data...",
                success: "Data Submitted successfully!",
                error: "Error submitting data!",
              })
              .then((response) => {
                console.log("Data transfer response:", response.data);
                resetForm();
              })
              .catch((error) => {
                if (error.response) {
                  // The request was made and the server responded with a status code
                  // that falls out of the range of 2xx
                  console.error("Error response data:", error.response.data);
                  console.error(
                    "Error response status:",
                    error.response.status
                  );
                  console.error(
                    "Error response headers:",
                    error.response.headers
                  );
                } else if (error.request) {
                  // The request was made but no response was received
                  console.error("Error request:", error.request);
                } else {
                  // Something happened in setting up the request that triggered an Error
                  console.error("Error message:", error.message);
                }
              })
              .finally(() => {
                setSubmitting(false);
              });
          } else {
            toast.error("Selected client not found!");
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <div className="d-flex justify-content-center align-items-center mt-4">
            <Form
              className="bg-light p-4 rounded shadow-sm"
              style={{ width: "100%", maxWidth: "400px" }}
            >
              <div className="mb-3">
                <label htmlFor="ClientID" className="form-label fw-bold">
                  Client Name
                </label>
                <Field as="select" name="ClientID" className="form-select">
                  <option value="">Select Client Name</option>
                  {clientNames.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.WhaClientName}
                    </option>
                  ))}
                </Field>
              </div>

              <div className="mb-3">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </Form>
          </div>
        )}
      </Formik>

      {/* ToastContainer for displaying notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="dark"
        transition={Bounce}
      />
    </div>
  );
};

export default DataTransfer;
