import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";

function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleAuthSuccess = async () => {
    setIsRedirecting(true);
    // Add a small delay to show the success state
    await new Promise(resolve => setTimeout(resolve, 1000));
    await router.push("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || isRedirecting) return;

    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name,
        });
        await handleAuthSuccess();
      }
    } catch (error) {
      let errorMessage = "Failed to create account. Please try again.";
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = "An account with this email already exists.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Invalid email address.";
          break;
        case 'auth/operation-not-allowed':
          errorMessage = "Email/password accounts are not enabled. Please contact support.";
          break;
        case 'auth/weak-password':
          errorMessage = "Password is too weak. Please choose a stronger password.";
          break;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signUpWithGoogle = async () => {
    if (loading || isRedirecting) return;
    
    setLoading(true);
    setError("");

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      await signInWithPopup(auth, provider);
      await handleAuthSuccess();
    } catch (error) {
      let errorMessage = "Failed to sign up with Google.";
      
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = "Sign-up cancelled. Please try again.";
          break;
        case 'auth/popup-blocked':
          errorMessage = "Pop-up blocked by browser. Please allow pop-ups for this site.";
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = "Sign-up cancelled. Please try again.";
          break;
        case 'auth/account-exists-with-different-credential':
          errorMessage = "An account already exists with this email but with different sign-in method.";
          break;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const buttonText = isRedirecting 
    ? "Redirecting..." 
    : loading 
      ? "Creating Account..." 
      : "Create Account";

  return (
    <div className="flex flex-col items-center bg-white h-screen">
      <div className="mt-8">
        <Link href="/">
          <Image
            src="/logo-dark.png"
            alt="Amazon Logo"
            width={150}
            height={40}
            className="cursor-pointer"
          />
        </Link>
      </div>

      <div className="w-full max-w-[350px] p-8 space-y-6">
        <h1 className="text-3xl font-medium mb-4">Create Account</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Your name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              required
              disabled={loading || isRedirecting}
              minLength={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              required
              disabled={loading || isRedirecting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              required
              disabled={loading || isRedirecting}
              minLength={6}
            />
            <p className="mt-1 text-xs text-gray-500">
              Password must be at least 6 characters long
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              required
              disabled={loading || isRedirecting}
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading || isRedirecting}
            className={`w-full bg-amazon_blue text-white py-2 px-4 rounded-md hover:bg-amazon_blue-light transition-colors duration-200 ${
              (loading || isRedirecting) ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {buttonText}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>

        <button
          onClick={signUpWithGoogle}
          disabled={loading || isRedirecting}
          className={`w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-50 transition-colors duration-200 ${
            (loading || isRedirecting) ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Image
            src="/google.png"
            alt="Google Logo"
            width={20}
            height={20}
          />
          Sign up with Google
        </button>

        <p className="text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-amazon_blue hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
