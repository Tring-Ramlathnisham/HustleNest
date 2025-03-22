import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { login } from "../../context/authSlice";
import styles from "./Auth.module.css";

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      role
      email
      token
    }
  }
`;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm(); // Form handling

  const [loginMutation, { loading, error }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      if (!data || !data.login) {
        console.error("Invalid login response");
        return;
      }

      const { id, role, email, token } = data.login;
      console.log(" Login Successful:", { id, email, role, token });

      // 🔹 Store token & user details in Redux
      dispatch(login({ user: { id, email }, token, role }));

      // 🔹 Redirect based on role
      navigate(role === "client" ? "/client/dashboard" : "/freelancer/dashboard");
    },
  });

  // 🔹 Form submission handler
  const onSubmit = async (formData) => {
    try {
      await loginMutation({ variables: {
        email:formData.email,
        password:formData.password,
       }
      });
    } catch (err) {
      console.error(" Login Error:", err.message);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.loginContainer}>
        <h2>Login</h2>
        {error && <p className={styles.errorMessage}>{error.message}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email format",
              },
            })}
          />
          {errors.email && <p className={styles.errorMessage}>{errors.email.message}</p>}

          <input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.password && <p className={styles.errorMessage}>{errors.password.message}</p>}

          <button type="submit"className={styles.authButton} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};


export default Login;
