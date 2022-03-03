import React, { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Form from "react-bootstrap/esm/Form";
import Row from "react-bootstrap/esm/Row";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import api from "../api/api";
import * as Yup from "yup";
import { UserValue } from "../utils/Interfaces";

interface SignUpProps {}

const SignUp: React.FC<SignUpProps> = () => {
  const styleError = { color: "red", margin: "10px", fontSize: "20px" };

  const [isConfirm, setIsConfirm] = useState(false);

  const SignupSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required email"),
    password: Yup.string()
      .min(2, "Too Short!")
      .max(70, "Too Long!")
      .required("Required password"),
    name: Yup.string()
      .min(2, "Too Short!")
      .max(70, "Too Long!")
      .required("Required name"),
    iban: Yup.string()
      .min(2, "Too Short!")
      .max(70, "Too Long!")
      .required("Required iban"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      name: "",
      iban: "",
    },
    validationSchema: SignupSchema,
    onSubmit: async (values: UserValue) => {
      const user = {
        email: values.email,
        password: values.password,
        name: values.name,
        iban: values.iban,
      };

      try {
        const res = await api.signup(
          user.email,
          user.password,
          user.name,
          user.iban
        );
        console.log(res.data);

        values.email = "";
        values.password = "";
        values.name = "";
        values.iban = "";

        if (res.data) {
          setIsConfirm(true);
          console.log("sono is confirm", isConfirm);
        }
      } catch (err) {
        console.log(err);
      }
    },
  });

  return (
    <div className="signup-page">
      {isConfirm ? (
        <>
          <h1>Registration successfully</h1>
          <Link to="/">
            <Button
              variant="outline-primary"
              size="lg"
              style={{ marginTop: "25px" }}
            >
              Go home page
            </Button>
          </Link>
        </>
      ) : (
        <>
          <h1>Create account</h1>
          <Row>
            <Col>
              <Form onSubmit={formik.handleSubmit}>
                <Form.Group className="mb-3" controlId="validationFormik01">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    name="email"
                    type="text"
                    placeholder="email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.email && formik.touched.email ? (
                    <p style={styleError}> {formik.errors.email}</p>
                  ) : null}
                </Form.Group>

                <Form.Group className="mb-3" controlId="validationFormik02">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    name="password"
                    type="password"
                    placeholder="password"
                    autoComplete="on"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.password && formik.touched.password ? (
                    <p style={styleError}> {formik.errors.password}</p>
                  ) : null}
                </Form.Group>

                <Form.Group className="mb-3" controlId="validationFormik03">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    name="name"
                    type="text"
                    placeholder="name"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.name && formik.touched.name ? (
                    <p style={styleError}> {formik.errors.name}</p>
                  ) : null}
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="validationFormik04">
                  <Form.Label>Iban</Form.Label>
                  <Form.Control
                    name="iban"
                    type="text"
                    placeholder="iban"
                    onChange={formik.handleChange}
                    value={formik.values.iban}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.iban && formik.touched.iban ? (
                    <p style={styleError}> {formik.errors.iban}</p>
                  ) : null}
                </Form.Group>
                <Button type="submit" variant="outline-primary">
                  signup
                </Button>
              </Form>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default SignUp;
