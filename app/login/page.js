"use client";
import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [loading, setLoading] = useState(false); // New loading state
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      router.push('/'); // Redirect after successful login
    } catch (err) {
      setError(err.message); // Set error message if login fails
    } finally {
      setLoading(false); // Reset loading state after processing
    }
  };

  const handlePasswordReset = async () => {
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, form.email);
      setResetMessage("Password reset email sent! Please check your email.");
      setError("");
    } catch (err) {
      setError("Unable to send reset email. Make sure the email is correct.");
      setResetMessage("");
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true); // Set loading to true
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDoc = doc(db, "users", user.uid);
      const userSnapshot = await getDoc(userDoc);
      if (!userSnapshot.exists()) {
        await setDoc(userDoc, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          createdAt: new Date(),
        });
      }
      router.push("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false); // Reset loading state after processing
    }
  };

  const signInWithGithub = async () => {
    const provider = new GithubAuthProvider();
    setLoading(true); // Set loading to true
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDoc = doc(db, "users", user.uid);
      const userSnapshot = await getDoc(userDoc);
      if (!userSnapshot.exists()) {
        await setDoc(userDoc, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          createdAt: new Date(),
        });
      }
      router.push("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false); // Reset loading state after processing
    }
  };

  const signInWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    setLoading(true); // Set loading to true
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDoc = doc(db, "users", user.uid);
      const userSnapshot = await getDoc(userDoc);
      if (!userSnapshot.exists()) {
        await setDoc(userDoc, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          createdAt: new Date(),
        });
      }
      router.push("/"); // Redirect to homepage
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false); // Reset loading state after processing
    }
  };

  return (
    <main className="min-h-screen flex gap-8 items-center justify-center bg-gray-900 text-white px-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-14 text-center">Login</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {resetMessage && <p className="text-green-500 text-center">{resetMessage}</p>}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
            <input
              value={form.email}
              onChange={handleChange}
              type="email"
              name="email"
              id="email"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
            <input
              value={form.password}
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
            <div
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              <img
                className='relative top-[10px] w-5 h-5'
                src={showPassword ? "/eye.png" : "/eyecross.png"}
                alt="Toggle password visibility"
              />
            </div>
          </div>

          {/* Login Button */}
          <div>
            <button
              type="submit"
              className="mt-6 w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-lg transition duration-300"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>

        {/* Forgot Password Link */}
        <div className="text-center mt-8">
          <button
            onClick={handlePasswordReset}
            className="text-sm text-green-600 hover:underline"
            disabled={loading} // Disable button when loading
          >
            Forgot Password?
          </button>
        </div>

        {/* Signup Redirect */}
        <p className="mt-6 text-center text-sm">
          Don&apos;t have an account?{' '}
          <a href="/signup">
            <span className="text-blue-400 hover:underline">Sign up</span>
          </a>
        </p>

        {/* Social sign-in options */}
        <div className='mt-8'>
          <hr className='bg-slate-900 lg:hidden' />
          <div className='text-gray-400 flex justify-center text-center lg:hidden relative mt-4 mb-8'>or</div>

          <div className='flex flex-col gap-2 lg:hidden relative bottom-3'>
            <button onClick={signInWithGoogle} type="button" className="text-white bg-[#4d8ef6] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex justify-center items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2">
              <svg className='w-5 h-5 me-2' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
              </svg>
              Sign in with Google
            </button>

            <button onClick={signInWithGithub} type="button" className="text-white bg-[#1b1e23] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex justify-center items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 me-2 mb-2">
              <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5A9.5 9.5 0 1 0 19.5 10 9.51 9.51 0 0 0 10 .5Zm2.875 14.25H7.125V8.75h2.75V6.875c0-2.75 1.625-4.375 4.375-4.375 1.25 0 2.375.125 2.625.125v2.875h-1.5c-1.125 0-1.375.5-1.375 1.25v1.625h2.75l-.375 2.5h-2.375Z" />
              </svg>
              Sign in with GitHub
            </button>

            <button onClick={signInWithFacebook} type="button" className="text-white bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex justify-center items-center dark:focus:ring-[#3b5998]/55 me-2 mb-2">
              <svg className="w-4 h-4 me-2" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 0a10 10 0 1 0 10 10A10.012 10.012 0 0 0 10 0Zm1.69 6.75h-2.23c-.18 0-.41.18-.41.5v1.69h2.63l-.33 2.25h-2.3v6h-2.5v-6h-2.5V9.5h2.5V7.75c0-2.25 1.24-3.5 3.17-3.5a12.58 12.58 0 0 1 1.78.16v2.25Z" />
              </svg>
              Sign in with Facebook
            </button>
          </div>
        </div>
      </div>


{/* Social sign in option for larger screens */}
<div className='text-gray-400 lg:inline-block hidden'>or</div>

<div className='lg:flex flex-col hidden'>
  <button onClick={signInWithGoogle} type="button" className="text-white bg-[#4d8ef6] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2">
  <svg className='w-5 h-5 me-2' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
<path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
</svg>
    Sign in with Google
  </button>

  <button onClick={signInWithGithub} type="button" className="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 me-2 mb-2">
    <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clipRule="evenodd"/>
    </svg>
    Sign in with Github
  </button>

  <button onClick={signInWithFacebook} type="button" className="text-white bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 me-2 mb-2">
<svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 8 19">
<path fillRule="evenodd" d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z" clipRule="evenodd"/>
</svg>
Sign in with Facebook
</button>
</div>

    </main>
  );
}
