import { Form, Link, redirect } from "react-router-dom";
import { FormInput, SubmitBtn } from "../components";
import { productionUrl } from "../utils";
import { toast } from "react-toastify";
import AvatarInput from "../components/AvatarInput";
import axios from "axios";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const regex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  if (!regex.test(data.email)) {
    toast.warning("Email is not valid");
    return null;
  }
  const password = data.password;

  if (password.length < 8) {
    toast.warning("Password should be at least 8 characters long");
    return null;
  }
  if (!/^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]+$/.test(password)) {
    toast.warning(
      "Password should have atleast one alphabet and atleast one number"
    );
    return null;
  }
  console.log(data);

  try {
    const response = await axios.post(
      `${productionUrl}/api/v1/auth/register`,
      data,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    toast.success("Account created successfully");
    return redirect("/login");
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || "Please double check your credentials";
    toast.error(errorMessage);
  }
  return null;
};

const Register = () => {
  return (
    <section className="h-screen grid place-items-center">
      <Form
        method="post"
        className="card shadow-lg p-8 w-96 flex flex-col gap-y-4"
        encType="multipart/form-data"
      >
        <h4 className="text-3xl font-bold text-center">Register</h4>
        <FormInput type="text" name="username" label="Username" />
        <FormInput label="Email" name="email" type="email" />
        <FormInput type="password" name="password" label="Password" />
        <AvatarInput type="file" name="avatarImage" label="Avatar" />
        <SubmitBtn text="Register" />
        <p className="text-center">
          Already a Member?{" "}
          <Link className="link link-primary link-hover" to="/login">
            Login
          </Link>
        </p>
      </Form>
    </section>
  );
};

export default Register;
