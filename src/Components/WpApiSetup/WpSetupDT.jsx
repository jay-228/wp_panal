import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const API_URL = "http://147.93.107.44:5000";

const WpSetupDT = () => {
  const [WpOffcialData, setWpOffcialData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [refreshData, setRefreshData] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_URL}/wha_offcialwa_view_All`)
      .then((response) => {
        setWpOffcialData(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [refreshData]);

  const validationSchema = Yup.object()
    .shape({
      WhatsappOffcialName: Yup.string().required("Select Name Required"),
      PARAMETER: Yup.string().required("Parameter is required"),
      IsUrl: Yup.boolean(),
      IsMobile: Yup.boolean(),
    })
    .test(
      "atLeastOneCheckbox",
      "At least one option must be selected",
      (values) => {
        return values.IsUrl || values.IsMobile;
      }
    );

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const payload = {
      id: selectedId,
      WhatsappOffcialName: values.WhatsappOffcialName,
      Parameter: values.PARAMETER,
      ISURL: values.IsUrl,
      IsMobile: values.IsMobile,
    };
    try {
      const response = await axios.post(
        `${API_URL}/wha_offcialwadt_add/${selectedId}`,
        payload
      );
      toast.success("Form submitted successfully!");
      console.log("API Response:", response.data);

      setRefreshData(!refreshData);
      resetForm();
      setSelectedId(null);
    } catch (error) {
      toast.error("Error submitting form!");
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
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
              WhatsApp Setup Details
            </h3>
          </div>
        </div>
      </div>

      <div
        className="d-flex justify-content-center align-items-center shadow p-4 rounded mt-5"
        style={{
          maxWidth: "350px",
          background: "#F8F9FA",
          margin: "auto",
        }}
      >
        <Formik
          initialValues={{
            WhatsappOffcialName: "",
            PARAMETER: "",
            IsUrl: false,
            IsMobile: false,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            setFieldValue,
            isSubmitting,
            values,
            touched,
            errors,
            resetForm,
          }) => (
            <Form style={{ width: "380px", background: "#F8F9FA" }}>
              <div className="mb-3">
                <label htmlFor="WhatsappOffcialName" className="form-label fw-bold">
                  WhatsApp Official Name
                </label>
                <Field
                  as="select"
                  id="WhatsappOffcialName"
                  name="WhatsappOffcialName"
                  className="form-select"
                  onChange={(e) => {
                    const selectedName = e.target.value;
                    const selectedItem = WpOffcialData.find(
                      (item) => item.WhatsappOffcialName === selectedName
                    );
                    setSelectedId(selectedItem ? selectedItem._id : null);
                    setFieldValue("WhatsappOffcialName", selectedName);
                  }}
                >
                  <option value="">Select Name</option>
                  {WpOffcialData.map((item) => (
                    <option key={item._id} value={item.WhatsappOffcialName}>
                      {item.WhatsappOffcialName}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="WhatsappOffcialName"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="mb-3 ">
                <label htmlFor="PARAMETER" className="form-label fw-bold">
                  Parameter
                </label>
                <Field type="text" name="PARAMETER" className="form-control fw-bold" />
                <ErrorMessage
                  name="PARAMETER"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="form-check mb-3">
                <Field
                  type="checkbox"
                  name="IsUrl"
                  className="form-check-input"
                  id="IsUrl"
                  checked={values.IsUrl}
                />
                <label className="form-check-label fw-bold" htmlFor="IsUrl">
                  Is Url
                </label>
              </div>

              <div className="form-check mb-3">
                <Field
                  type="checkbox"
                  name="IsMobile"
                  className="form-check-input"
                  id="IsMobile"
                  checked={values.IsMobile}
                />
                <label className="form-check-label fw-bold" htmlFor="IsMobile">
                  Is Mobile
                </label>
              </div>

              {touched.IsUrl &&
                touched.IsMobile &&
                (errors.IsUrl || errors.IsMobile) && (
                  <div className="text-danger">{errors.atLeastOneCheckbox}</div>
                )}

              <div className="d-flex justify-content-center mt-4">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <ToastContainer />
    </>
  );
};

export default WpSetupDT;
