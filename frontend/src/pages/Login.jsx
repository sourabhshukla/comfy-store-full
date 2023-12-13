import { Form, Link, redirect, useNavigate } from "react-router-dom";
import { FormInput, SubmitBtn } from "../components";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/user/userSlice";
import { productionUrl } from "../utils";

export const action =
  (store) =>
  async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const dispatch = store.dispatch;
    const userState = store.getState().userState;
    console.log(userState);

    if (userState.user) {
      toast.success("User is already logged in!");
      return redirect("/");
      //return null;
    }

    try {
      const response = await axios.post(
        `${productionUrl}/api/v1/auth/login`,
        data
      );
      console.log(response.data);
      dispatch(loginUser(response.data));
      toast.success("Logged in Successfully!");
      return redirect("/");
    } catch (error) {
      console.log(error);
      const errorMessage =
        error?.response?.data?.message ||
        "Please double check your credentials";
      toast.error(errorMessage);
    }
    return null;
  };

const Login = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (user != null) {
    redirect("/");
    toast.success("User is already logged in");
  }

  const loginAsGuestUser = async () => {
    try {
      const response = await axios.post(`${productionUrl}/api/v1/auth/login`, {
        email: "guest@gmail.com",
        password: "123456789",
      });
      console.log(response.data);
      dispatch(loginUser(response.data));
      toast.success("Logged in Successfully!");
      navigate("/");
    } catch (error) {
      console.log(error);
      const errorMessage =
        error?.response?.data?.message ||
        "Please double check your credentials";
      toast.error(errorMessage);
    }
  };
  return (
    <section className="h-screen grid place-items-center">
      <Form
        method="post"
        className="card w-96 bg-base-100 shadow-lg p-8 flex flex-col gap-y-4"
      >
        <h4 className="text-center text-3xl font-bold">Login</h4>
        <FormInput type="email" label="Email" name="email" defaultValue="" />
        <FormInput
          type="password"
          label="Password"
          name="password"
          defaultValue=""
        />
        <div className="mt-4">
          <SubmitBtn text="login" />
        </div>
        <button
          type="button"
          onClick={loginAsGuestUser}
          className="btn btn-secondary btn-block"
        >
          guest user
        </button>
        <p className="text-center">
          Not a member yet?{" "}
          <Link to="/register" className="ml-2 link link-primary link-hover">
            Register
          </Link>
        </p>
        <p className="text-center">
          <Link
            to="/forgot/password"
            className="ml-2 link link-secondary link-hover"
          >
            Forgot Password
          </Link>
        </p>
      </Form>
    </section>
  );
};

export default Login;
