import { userSignupForm } from "@/types";

export const signUpValidation = ({ email, password, confirmPassword }: userSignupForm) => {
  const regexpPass = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  const minPassLength = 6;

  if (password.length < minPassLength) {
    return "Min 6 chars in pass";
  }

  if (!regexpPass.test(password)) {
    return "Password should contain at least one number and one special character";
  }

  if (password !== confirmPassword) {
    return "Passes doesnt match";
  } else return "";
};
