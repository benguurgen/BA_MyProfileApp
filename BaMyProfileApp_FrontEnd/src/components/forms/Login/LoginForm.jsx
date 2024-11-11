import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import LoginService from "../../services/LoginService";
import { useNavigate } from "react-router-dom";
import "../../../assets/styles/LoginFormm.scss";
import { toast } from "react-toastify";

const LoginForm = ({ setIsAuthenticated }) => {
  const [togglePassword, setTogglePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [tokenIssueTime, setTokenIssueTime] = useState(
    () => parseInt(localStorage.getItem("tokenIssueTime") || sessionStorage.getItem("tokenIssueTime"))
  );
  const navigate = useNavigate();

    useEffect(() => {
      const sessionExpiredMessage = localStorage.getItem("sessionExpiredMessage");
      if (sessionExpiredMessage) {
        toast.error(sessionExpiredMessage, {
          autoClose: true,
          closeButton: true
        });
        localStorage.removeItem("sessionExpiredMessage");
      }
    }, []);


  const validationControl = (email, password) => {
    let validationErrors = {};

    if (!email) {
        validationErrors.EMAIL = "Email cannot be empty.";
    } else {
      
        const validDomainsPattern = /@(gmail\.com|hotmail\.com|bamyprofileapp\.com)$/;
        if (!validDomainsPattern.test(email)) {
            validationErrors.EMAIL = "Email must end with @gmail.com, @hotmail.com, or @bamyprofileapp.com.";
        }
    }

    if (!password) {
        validationErrors.PASSWORD = "Password cannot be empty.";
    }

    if (!email || !password) {
        validationErrors.LOGIN = "Please check your login details and try again.";
    }

    setError(Object.values(validationErrors).join(" "));
    
    return Object.keys(validationErrors).length === 0; 
};


  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const email = event.target[0].value;
    const password = event.target[1].value;

    const validationResult = validationControl(email, password);
    if (!validationResult) {
      setLoading(false);
      return;
    }

    const data = {
      email,
      password,
    };

    try {
      const response = await LoginService.LoginServiceAsync(data);
      if (response.status === 200 && response.data.isSuccess) {
        const token = response.data.data;
        const newTokenIssueTime = new Date().getTime();
        if (rememberMe) {
          localStorage.setItem("Token", token);
          localStorage.setItem("tokenIssueTime", newTokenIssueTime);
        } else {
          sessionStorage.setItem("Token", token);
          sessionStorage.setItem("tokenIssueTime", newTokenIssueTime);
        }
        setTokenIssueTime(newTokenIssueTime); 
        setIsAuthenticated(true);
        navigate("/home");
      } else {
        setError("Please check your login details and try again.");
      }
    } catch (error) {
      setError("Please check your login details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="cont">
        <div className="demo">
          <div className="login">
            <div className="login__check"></div>
            <div className="login__form">
              <form onSubmit={handleLogin} className="form-login">
                <div className="login__row">
                  <FontAwesomeIcon icon={faUser} className="login__icon" />
                  <input
                    type="text"
                    className="login__input name"
                    name="email"
                    placeholder="Email"
                  />
                </div>
                <div className="login__row">
                  <FontAwesomeIcon icon={faLock} className="login__icon" />
                  <div className="input-password">
                    <input
                      type={togglePassword ? "text" : "password"}
                      className="login__input pass"
                      name="password"
                      placeholder="Password"
                    />
                    <FontAwesomeIcon
                      onClick={() => setTogglePassword(!togglePassword)}
                      icon={!togglePassword ? faEye : faEyeSlash}
                      className="password-icons"
                    />
                  </div>
                </div>
                <div className="login_checkbox">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    className="remember-me-checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label className="rememberr">Remember Me</label>
                </div>

                {error && <p className="error-message">{error}</p>}
                <button
                  type="submit"
                  className="login__submit"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Login"}
                </button>
                <p className="login__signup">
                  &nbsp;<a href="#">Forgot Password?</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
