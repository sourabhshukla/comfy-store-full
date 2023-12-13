import { Form, Link, redirect } from "react-router-dom";
import FormInput from "./FormInput";
import SubmitBtn from "./SubmitBtn";
import axios from "axios";
import { toast } from "react-toastify";
import { productionUrl } from "../utils";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const token = localStorage.getItem("token");

  try {
    await axios.put(`${productionUrl}/api/v1/auth/password/update`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    toast.success("Password changed Successfully");
    return redirect("/");
  } catch (error) {
    console.log(error);
    const errorMessage =
      error?.response?.data?.message || "Please double check your credentials";
    toast.error(errorMessage);
  }
  return null;
};

const UpdatePassword = () => {
  return (
    <section className="h-screen grid place-items-center">
      <Form
        method="post"
        className="card w-96 bg-base-100 shadow-lg p-8 flex flex-col gap-y-4"
      >
        <h4 className="text-center text-3xl font-bold">Update Password</h4>

        <FormInput
          type="password"
          label="Old Password"
          name="oldPassword"
          defaultValue=""
        />
        <FormInput
          type="password"
          label="New Password"
          name="newPassword"
          defaultValue=""
        />
        <div className="mt-4">
          <SubmitBtn text="Update" />
        </div>
      </Form>
    </section>
  );
};

export default UpdatePassword;
