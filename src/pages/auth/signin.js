import { getProviders, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";

function SignIn({ providers }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Clear error when URL changes
    if (router.query.error) {
      setError("Authentication failed. Please try again.");
    }
  }, [router.query]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
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
            src="/logo-dark.png"
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
          <h1 className="text-3xl font-medium mb-4">Sign in</h1>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
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

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-4 text-sm text-gray-600">
            By continuing, you agree to Amazon's Conditions of Use and Privacy Notice.
          </div>
        </div>

        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or sign in with
              </span>
            </div>
          </div>

          <div className="mt-4">
            {Object.values(providers)
              .filter((provider) => provider.id === "google")
              .map((provider) => (
                <div key={provider.id}>
                  <button
                    onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                    className="w-full flex items-center justify-center space-x-2 border rounded-lg p-3 hover:bg-gray-50"
                    disabled={loading}
                  >
                    <Image
                      src="/google.png"
                      alt="Google Logo"
                      width={40}
                      height={20}
                    />
                    <span>Continue with {provider.name}</span>
                  </button>
                </div>
              ))}
          </div>
        </div>

        <div className="mt-4 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">New to Amazon?</span>
            </div>
          </div>

          <Link href="/auth/register">
            <button className="mt-4 w-full p-2 border border-gray-300 rounded bg-gray-100 hover:bg-gray-200">
              Create your Amazon account
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}

export default SignIn;
