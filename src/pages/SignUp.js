// Sign up page for new users
// NEED TO FIX CANCEL BUTTON, UPDATE PARAMS/NAVIGATES/ROUTES IF NEEDED
// Need to add Validations for age/alert
// window.alert can be changed to modal or fix issue where it asks user twice
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import app from "../firebase";
import { useUser } from "../contexts/UserProvider";

const API = process.env.REACT_APP_API_URL;

function SignUp({ setLoggedIn }) {
  // useNavigate and useParams hooks to navigate to user profile page
  const navigate = useNavigate();
  const { id } = useParams();

  // Sets the user in local storage
  const { setLoggedInUser } = useUser();

  // useState hook to toggle between show/hide password
  const [showPassword, setShowPassword] = useState(false);

  const [ageError, setAgeError] = useState("");

  const [usernameError, setUsernameError] = useState("");

  const auth = getAuth(app);

  // useState hook to store user information
  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    age: "",
    pronouns: "",
    bio: "About Me",

    profile_img:
      "https://www.pngitem.com/pimgs/m/24-248366_profile-clipart-generic-user-generic-profile-picture-gender.png",
    firebase_id: "",
  });

  // function to update newUser object on text change
  const handleTextChange = (e) => {
    setNewUser({ ...newUser, [e.target.id]: e.target.value });
  };

  // function to sign user out before their new account is created
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        setLoggedInUser({});
        setLoggedIn(false);
        console.log("signed out");
        navigate(`/`);
      })
      .catch((error) => {
        // An error happened.
      });
  };

  //   // function to create a new account with firebase and update the newUser object with firebase_id
  const createUserCredentials = async () => {
    try {
      const userCredentialResponse = await createUserWithEmailAndPassword(
        auth,
        newUser.email,
        newUser.password
      );
      const firebaseId = await userCredentialResponse.user.uid;
      return { ...newUser, firebase_id: firebaseId };
    } catch (error) {
      console.error("Error creating credentials", error);
    }
  };

  const checkAge = () => {
    const currentDate = new Date();
    const birthDateObj = new Date(newUser.age);

    let personAge = currentDate.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDateObj.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && currentDate.getDate() < birthDateObj.getDate())
    ) {
      personAge--;
    }

    if (personAge >= 18) {
      return true;
    } else {
      return false;
    }
  };

  const checkUsername = () => {
    return axios
      .get(`${API}/users?username=${newUser?.username}`)
      .then((res) => {
        return res.data.length > 0;
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  };

  // function to make an axios POST request and navigate to the user profile page
  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;
    handleSignOut();
    if (!checkAge()) {
      setAgeError("User must be 18 or over");
      isValid = false;
    }

    // if (await checkUsername()) {
    //   setUsernameError("Username already taken");
    //   isValid = false;
    // }

    const userCredentials = await createUserCredentials();

    axios
      .post(`${API}/users`, userCredentials)
      .then(() => {
        navigate(`/personalprofile`);
      })
      .catch((c) => console.warn("catch, c"));

    if (isValid) {
      signInWithEmailAndPassword(auth, newUser.email, newUser.password)
        .then((userCredential) => {
          const returningUser = userCredential.user;
          if (returningUser) {
            alert("You are now logged in!");
            console.log("logged in");
            // setUser(returningUser);
          }
        })
        .catch((error) => {
          const errorCode = error.code;
          console.log(errorCode);
        });
    }
  };

  // useEffect to show age requirement alert on page load and alert if user input age is below 18
  useEffect(() => {
    let age = Number(
      prompt(
        "Please note this site is 18+ only. Enter your age in years below:"
      )
    );

    if (age < 18) {
      alert("Sorry, you must be at least 18 to access this site.");
      navigate("/");
    }
  }, []);

  return (
    <div className="sm:w-full md:w-3/5 lg:w-2/5 md:m-auto mx-3 my-6 p-1">
      <form className="bg-white text-slate-800 shadow-md rounded px-10 pt-6 pb-8 mb-4 mt-6">
        <div className="mb-4">
          <div className="mb-4">
            <label
              htmlFor="age"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Date of Birth
              <input
                type="date"
                name="age"
                id="age"
                required
                onChange={handleTextChange}
                className="rounded block my-2 border border-black px-2 py-2"
              />
            </label>
          </div>
          {ageError && <p style={{ color: "red" }}>{ageError}</p>}
          <label
            htmlFor="first_name"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            First Name
          </label>
          <input
            type="text"
            name="first_name"
            id="first_name"
            required
            onChange={handleTextChange}
            className="mb-5 pl-3 border border-black block m-auto shadow bg-transparent appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="last_name"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Last Name
          </label>
          <input
            id="last_name"
            required
            onChange={handleTextChange}
            className="mb-5 pl-3 block m-auto shadow bg-transparent appearance-none border border-slate-800 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            required
            onChange={handleTextChange}
            className="mb-5 pl-3 block border border-black m-auto shadow bg-transparent appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {usernameError && <p style={{ color: "red" }}>{usernameError}</p>}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Email
          </label>
          <input
            type="text"
            name="email"
            id="email"
            required
            onChange={handleTextChange}
            className="mb-5 pl-3 block m-auto border border-black shadow bg-transparent appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            required
            onChange={handleTextChange}
            className="shadow bg-transparent border border-black appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {showPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-sm underline hover:text-blue-400 inline pt-2"
            >
              Hide password
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-sm underline hover:text-blue-400 inline pt-2"
            >
              Show password
            </button>
          )}
        </div>
        <div className="flex justify-evenly">
          <button type="submit" onClick={handleSubmit} className="bg-cyan-400 hover:bg-purple-500 text-slate-100 uppercase text-sm font-bold py-2 px-4 rounded-md">
            Submit
          </button>
          <button onClick={() => navigate("/")} className="block border border-gray-500 hover:bg-[#f6854b] hover:border-[#f6854b] text-slace-900 hover:text-slate-100 uppercase text-sm font-bold p-2 rounded-md">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
