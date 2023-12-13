import { Form } from "react-router-dom";
import FormInput from "./FormInput";
import SubmitBtn from "./SubmitBtn";
import axios from "axios";
import { toast } from "react-toastify";
import { productionUrl } from "../utils";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    await axios.post(`${productionUrl}/api/v1/auth/password/forgot`, data);
    toast.success("Email Sent Successfully");
  } catch (error) {
    console.log(error);
    const errorMessage =
      error?.response?.data?.message || "Please double check your credentials";
    toast.error(errorMessage);
  }
  return null;
};

const ForgotPassword = () => {
  return (
    <section className="h-screen grid place-items-center">
      <Form
        method="post"
        className="card w-96 bg-base-100 shadow-lg p-8 flex flex-col gap-y-4"
      >
        <h4 className="text-center text-3xl font-bold">Forgot Password</h4>

        <FormInput type="email" label="email" name="email" defaultValue="" />

        <div className="mt-4">
          <SubmitBtn text="Submit" />
        </div>
      </Form>
    </section>
  );
};

export default ForgotPassword;
