import { auth, googleProvider } from "../firebase/config";
import { signInWithPopup } from "firebase/auth";
import { useAppDispatch } from "../app/hooks";
import { googleLogin } from "../features/auth/authThunks";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

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

  return (
    <button
      onClick={handleGoogleLogin}
      type="button"
      className="w-full flex items-center justify-center gap-3 bg-white border border-[var(--border-color)] rounded-lg py-3 font-medium text-[var(--text-body) shadow-sm hover:shadow-md hover:scale-[1.02 active:scale-[0.99] transition-all duration-200"
    >
      <FcGoogle size={20} />
      Continue with Google
    </button>
  );
};

export default GoogleLoginButton;
