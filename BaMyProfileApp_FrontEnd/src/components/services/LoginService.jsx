import { Api } from "../api/Api";

const LoginService = {
  async LoginServiceAsync(data) {
    return await Api.handleRequestPostAsync(
      "Authentication/Login",
      data,
      false,
      false
    );
  },
  Logout() {
    sessionStorage.clear();
  },
};

export default LoginService;
