import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client"; // Import useMutation
import { register } from "../../context/authSlice";
import styles from "./Auth.module.css"; 

// 🔹 GraphQL mutation for registration
const REGISTER_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $password: String!, $role: String!) {
    register(name: $name, email: $email, password: $password, role: $role) {
      id
      name
      email
      role
      token
    }
  }
`;

const Register = () => {
  const { register: formRegister, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🔹 useMutation hook for registration
  const [registerMutation, { loading, error }] = useMutation(REGISTER_MUTATION, {
    onCompleted: (data) => {
      if (!data || !data.register) {
        console.error("Invalid register response");
        return;
      }
      const { id, name, email, role, token } = data.register;
      console.log("Registration Successful:", { id, name, email, role, token });

      // Dispatch register action to Redux
      dispatch(register({ user:{id,email} ,role: role, token:token }));

      // Redirect based on role
      navigate(role === "client" ? "/client/dashboard" : "/freelancer/dashboard");
    },
  });

  // 🔹 Form submission handler
  const onSubmit = async (formData) => {
    try {
      await registerMutation({ variables: formData });
    } catch (err) {
      console.error("Registration Error:", err.message);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.loginContainer}>
        <h2>Register</h2>
        
        {error && <p className={styles.errorMessage}>{error.message}</p>} {/* Error message */}
        
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Full Name Field */}
          <input 
            type="text" 
            placeholder="Full Name" 
            {...formRegister("name", { required: "Full Name is required" })} 
          />
          {errors.name && <p className={styles.errorMessage}>{errors.name.message}</p>}

          {/* Email Field */}
          <input 
            type="email" 
            placeholder="Email" 
            {...formRegister("email", { 
              required: "Email is required", 
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" }
            })} 
          />
          {errors.email && <p className={styles.errorMessage}>{errors.email.message}</p>}

          {/* Password Field */}
          <input 
            type="password" 
            placeholder="Password" 
            {...formRegister("password", { 
              required: "Password is required", 
              minLength: { value: 6, message: "Password must be at least 6 characters" }
            })} 
          />
          {errors.password && <p className={styles.errorMessage}>{errors.password.message}</p>}

          {/* Role Selection */}
          <select {...formRegister("role", { required: "Role is required" })}>
            <option value="">Select Role</option>
            <option value="client">Client</option>
            <option value="freelancer">Freelancer</option>
          </select>
          {errors.role && <p className={styles.errorMessage}>{errors.role.message}</p>}

          {/* Submit Button */}
          <button type="submit" className={styles.authButton} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className={styles.alreadyAccount}>Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  );
};

export default Register;
