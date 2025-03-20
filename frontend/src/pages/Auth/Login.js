import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { login } from "../../context/authSlice";
import "./Auth.css";

// 🔹 GraphQL mutation for login
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

  // 🔹 useMutation hook for login
  const [loginMutation, { loading, error }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      if (!data || !data.login) {
        console.error("Invalid login response");
        return;
      }

      const { id, role, email, token } = data.login;
      console.log("✅ Login Successful:", { id, email, role, token });

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
    <div className="auth-page">
      <div className="login-container">
        <h2>Login</h2>
        {error && <p className="error-message">{error.message}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email Field */}
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
          {errors.email && <p className="error-message">{errors.email.message}</p>}

          {/* Password Field */}
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
          {errors.password && <p className="error-message">{errors.password.message}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
