import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const API_URL = "http://147.93.107.44:5000";

const ClientDT = () => {
  const [clientNames, setClientNames] = useState([]);
  const [whaSlabOptions, setWhaSlabOptions] = useState([]);
  const [selectedSlabID, setSelectedSlabID] = useState("");

  useEffect(() => {
    console.log("Fetching clients...");
    axios
      .get(`${API_URL}/client_view_All`)
      .then((response) => {
        console.log("Fetched client names:", response.data.data);
        setClientNames(response.data.data);
      })
      .catch((error) => {
        toast.error("Error fetching client names!");
        console.error("Error fetching client names:", error);
      });

    console.log("Fetching slabs...");
    axios
      .get(`${API_URL}/slabdt_view`)
      .then((res) => {
        console.log("Fetched slabs:", res.data);
        if (Array.isArray(res.data)) {
          setWhaSlabOptions(
            res.data.filter((item) => item?.WhaSlabID?.WhaSlabName)
          );
        } else if (Array.isArray(res.data.data)) {
          setWhaSlabOptions(
            res.data.data.filter((item) => item?.WhaSlabID?.WhaSlabName)
          );
        } else {
          toast.error("Error: Slabs data is not an array");
        }
      })
      .catch(() => {
        toast.error("Error fetching slabs!");
        console.error("Error fetching slabs");
      });
  }, []);

  const handleSlabNameChange = (setFieldValue, selectedSlabID) => {
    console.log("Slab selected:", selectedSlabID);
    setSelectedSlabID(selectedSlabID);

    console.log("Available slabs:", whaSlabOptions);
    console.log("Searching for slab ID:", selectedSlabID);

    const selectedSlab = whaSlabOptions.find(
      (item) => item?.WhaSlabDtID?._id === selectedSlabID
    );

    console.log("Selected slab details:", selectedSlab);

    setFieldValue("WhaSlabDtID", selectedSlabID);
    setFieldValue(
      "whaSlabName",
      selectedSlab ? selectedSlab.WhaSlabID?.WhaSlabName : ""
    );
  };

  const validationSchema = Yup.object({
    WhaClientName: Yup.string().required("Client Name is required"),
    WhaSlabDtID: Yup.string().required("Slab Name is required"),
    WhaCount: Yup.number()
      .required("Total Balance is required")
      .positive()
      .integer(),
    WhaBalCount: Yup.number()
      .required("Balance  is required")
      .positive()
      .integer(),
    WhaDate: Yup.date()
      .required("Date is required")
      .test("date-in-24-hours", "Date must be within 24 hours", (value) => {
        const currentTime = new Date();
        const selectedTime = new Date(value);
        return (
          selectedTime <= new Date(currentTime.getTime() + 24 * 60 * 60 * 1000)
        );
      }),
  });

  const handleSubmit = async (
    values,
    { setSubmitting, setFieldError, resetForm }
  ) => {
    try {
      console.log("Form data before submitting:", values);

      const selectedDate = new Date(values.WhaDate);
      const currentTime = new Date();

      selectedDate.setHours(currentTime.getHours());
      selectedDate.setMinutes(currentTime.getMinutes());
      selectedDate.setSeconds(currentTime.getSeconds());

      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const hours = String(selectedDate.getHours()).padStart(2, "0");
      const minutes = String(selectedDate.getMinutes()).padStart(2, "0");

      values.WhaDate = `${year}-${month}-${day} ${hours}:${minutes}`;

      await axios.post(
        `${API_URL}/clientdt_add/${values.WhaClientName}/${values.WhaSlabDtID}`,
        {
          WhaCount: values.WhaCount,
          WhaBalCount: values.WhaBalCount,
          WhaDate: values.WhaDate,
          WhaSlabName: values.whaSlabName,
        }
      );

      toast.success("Data added successfully!");
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error submitting data!");
      setFieldError(
        "general",
        error.response?.data?.message || "Error submitting data!"
      );
      console.error("Error submitting data:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
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
              Client Detail
            </h3>
          </div>
        </div>
      </div>

      <div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <div className="d-flex justify-content-center align-items-center mt-4">
          <Formik
            initialValues={{
              WhaClientName: "",
              WhaSlabDtID: "",
              WhaCount: "",
              WhaBalCount: "",
              WhaDate: "",
              whaSlabName: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, values }) => (
              <Form
                className="bg-light p-4 rounded shadow-sm"
                style={{ width: "100%", maxWidth: "400px" }}
              >
                <div className="mb-3">
                  <label htmlFor="WhaClientName" className="form-label fw-bold">
                    Client Name
                  </label>
                  <Field
                    as="select"
                    name="WhaClientName"
                    className="form-select"
                    onChange={(e) => {
                      setFieldValue("WhaClientName", e.target.value);
                    }}
                  >
                    <option value="">Select a client</option>
                    {clientNames.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.WhaClientName}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="WhaClientName"
                    component="div"
                    className="text-danger"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="whaSlabName" className="form-label fw-bold">
                    Slab Name
                  </label>
                  <Field
                    as="select"
                    name="WhaSlabDtID"
                    className="form-select"
                    onChange={(e) =>
                      handleSlabNameChange(setFieldValue, e.target.value)
                    }
                    value={values.WhaSlabDtID}
                  >
                    <option value="">Select Slab Name</option>
                    {whaSlabOptions?.map((item) => (
                      <option key={item?._id} value={item?._id}>
                        {item?.WhaSlabID?.WhaSlabName}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="WhaSlabDtID"
                    component="div"
                    className="text-danger"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Total Balance</label>
                  <Field
                    type="number"
                    name="WhaCount"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="WhaCount"
                    component="div"
                    className="text-danger"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Balance</label>
                  <Field
                    type="number"
                    name="WhaBalCount"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="WhaBalCount"
                    component="div"
                    className="text-danger"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Date</label>
                  <Field type="date" name="WhaDate" className="form-control" />
                  <ErrorMessage
                    name="WhaDate"
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
    </div>
  );
};

export default ClientDT;
