import { Form, redirect } from "react-router-dom";
import { FormInput, SubmitBtn } from "../components";
import { productionUrl } from "../utils";
import { toast } from "react-toastify";
import AvatarInput from "../components/AvatarInput";
import axios from "axios";
import { useSelector } from "react-redux";

export const action =
  (store) =>
  async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    console.log(data);
    const state = store.getState();
    const token = state.userState.token;

    try {
      const response = await axios.put(
        `${productionUrl}/api/v1/user/me/update`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Profile Update Successfully successfully");
      return redirect("/");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "Please double check your credentials";
      toast.error(errorMessage);
    }
    return null;
  };

const UpdateProfile = () => {
  const user = useSelector((state) => state.userState.user);
  console.log(user);

  if (!user) {
    toast.error("Please Login first to update the profile");
    return redirect("/login");
  }
  return (
    <section className="h-screen grid place-items-center">
      <Form
        method="post"
        className="card shadow-lg p-8 w-96 flex flex-col gap-y-4"
        encType="multipart/form-data"
      >
        <h4 className="text-3xl font-bold text-center">Update Profile</h4>
        <FormInput
          type="text"
          name="username"
          label="Username"
          defaultValue={user.username}
        />
        <FormInput
          label="Email"
          name="email"
          type="email"
          defaultValue={user.email}
        />
        {/* <FormInput
          type="password"
          name="password"
          label="Password"
          defaultValue=""
        /> */}
        <AvatarInput type="file" name="avatarImage" label="Avatar" />
        <SubmitBtn text="Update Profile" />
        {/* <p className="text-center">
          Already a Member?{" "}
          <Link className="link link-primary link-hover" to="/login">
            Login
          </Link>
        </p> */}
      </Form>
    </section>
  );
};

export default UpdateProfile;
