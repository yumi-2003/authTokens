import { auth, googleProvider } from "../firebase/config";
import { signInWithPopup } from "firebase/auth";
import { useAppDispatch } from "../app/hooks";
import { googleLogin } from "../features/auth/authThunks";
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      await dispatch(googleLogin(idToken)).unwrap();
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Google login error:", error);
      alert(error.message || "Google login failed");
    }
  };

  return <button onClick={handleGoogleLogin}>Continue with Google</button>;
};

export default GoogleLoginButton;
