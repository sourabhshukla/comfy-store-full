import { Form, redirect } from "react-router-dom";
import FormInput from "./FormInput";
import SubmitBtn from "./SubmitBtn";
import axios from "axios";
import { toast } from "react-toastify";
import { productionUrl } from "../utils";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const token = request.url.split("/").reverse()[0];
  // console.log(request.url);

  try {
    await axios.put(
      `${productionUrl}/api/v1/auth/password/reset/${token}`,
      data
    );
    toast.success("Password Reset Successfull");
    return redirect("/login");
  } catch (error) {
    console.log(error);
    const errorMessage =
      error?.response?.data?.message || "Please double check your credentials";
    toast.error(errorMessage);
  }
  return null;
};

function ResetPassword() {
  return (
    <section className="h-screen grid place-items-center">
      <Form
        method="post"
        className="card w-96 bg-base-100 shadow-lg p-8 flex flex-col gap-y-4"
      >
        <h4 className="text-center text-3xl font-bold">Reset Password</h4>

        <FormInput
          type="password"
          label="Password"
          name="password"
          defaultValue=""
        />
        <FormInput
          type="password"
          label="Confirm Password"
          name="confirmPassword"
          defaultValue=""
        />
        <div className="mt-4">
          <SubmitBtn text="Reset" />
        </div>
      </Form>
    </section>
  );
}

export default ResetPassword;
