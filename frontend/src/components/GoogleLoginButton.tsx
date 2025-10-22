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

      const data = await dispatch(googleLogin(idToken)).unwrap();
      if (data.user.role === "admin") {
        navigate("/dashboard/admin");
      } else {
        navigate("/dashboard/user");
      }
    } catch (error: unknown) {
      console.error("Google login error:", error);
      if (error instanceof Error) {
        alert(error.message || "Google login failed");
      } else {
        // Fallback for non-Error throw values
        alert(String(error) || "Google login failed");
      }
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      type="button"
      className="w-full flex items-center justify-center gap-3 bg-white border border-(--border-color) rounded-lg py-3 font-medium text-[var(--text-body) shadow-sm hover:shadow-md hover:scale-[1.02 active:scale-[0.99] transition-all duration-200"
    >
      <FcGoogle size={20} />
      Continue with Google
    </button>
  );
};

export default GoogleLoginButton;
