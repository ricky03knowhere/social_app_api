const isEmpty = (string) => {
  // console.log(string)
  // if (string.trim() === "") return true;
  // else return false;
  return !string || string.trim() === "";
};

const isEmail = (email) => {
  const emailRegEx =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) return true;
  else false;
};

const signupValidator = ({ email, password, confirmPassword, handle }) => {
  let errors = {};

  if (isEmpty(email)) errors.email = "Must not be empty!";
  else if (!isEmail(email)) errors.email = "Invalid email format!";

  if (isEmpty(password)) errors.password = "Must not be empty!";

  if (password !== confirmPassword)
    errors.confirmPassword = "Password not match!";

  if (isEmpty(handle)) errors.handle = "Must not be empty!";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

const loginValidator = ({ email, password }) => {
  let errors = {};

  if (isEmpty(email)) errors.email = "Must not be empty!";
  else if (!isEmail(email)) errors.email = "Invalid email format!";

  if (isEmpty(password)) errors.password = "Must not be empty!";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

const reduceUserDetails = (data) => {
  let userDetails = {};
console.log(data)
  if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;

  if (!isEmpty(data.website.trim())) {
    if (data.website.substring(0, 4) !== "http") {
      userDetails.website = `http://${data.website.trim()}`;
    } else userDetails.website = data.website;
  }
  if (!isEmpty(data.location.trim())) userDetails.location = data.location;

  return userDetails;
};

module.exports = {
  signupValidator,
  loginValidator,
  reduceUserDetails,
};
