import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { createUserWithEmailAndPassword, updateProfile, signIn } from "firebase/auth";
import { auth } from "../../firebase";

function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
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

        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
          callbackUrl: "/"
        });

        if (result?.error) {
          setError(result.error);
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center bg-white h-screen">
      <div className="mt-8">
        <Link href="/">
          <Image
            src="https://links.papareact.com/f90"
            width={150}
            height={40}
            objectFit="contain"
            className="cursor-pointer"
            alt="Amazon Logo"
          />
        </Link>
      </div>

      <div className="w-full max-w-[350px] p-6 mt-4">
        <div className="w-full p-6 bg-white rounded border border-gray-300">
          <h1 className="text-3xl font-medium mb-4">Create account</h1>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Your name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-yellow-500"
                required
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-yellow-500"
                required
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-yellow-500"
                required
                minLength={6}
                disabled={loading}
              />
              <p className="mt-1 text-xs text-gray-500">
                Passwords must be at least 6 characters.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-yellow-500"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="w-full button"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create your Amazon account"}
            </button>
          </form>

          <div className="mt-4 text-sm text-gray-600">
            By creating an account, you agree to Amazon's Conditions of Use and Privacy Notice.
          </div>
        </div>

        <div className="mt-4 p-4 border border-gray-300 rounded bg-gray-50">
          <p className="text-sm">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-blue-600 hover:text-amazon_blue hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
