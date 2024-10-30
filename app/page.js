"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Typewriter } from 'react-simple-typewriter';
import Link from 'next/link';
import { auth, db } from "@/app/firebase";
import { doc, getDoc } from 'firebase/firestore'; 
import { onAuthStateChanged, signOut } from "firebase/auth";


export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setIsAuthenticated(true);
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid)); 
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: currentUser.uid,
              email: userData.email,
              displayName: userData.displayName,
              createdAt: userData.createdAt,
            });
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });

    return () => unsubscribe(); 
  }, []);

  const handleStartNow = () => {
    if (isAuthenticated) {
      router.push('/chat'); // Redirect to chat if authenticated
    } else {
      router.push('/signup'); // Redirect to signup if not authenticated
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/"); // Redirect to home after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      {/* Top Buttons */}
      <div className="absolute top-4 w-full flex justify-between px-6 z-10">
      {isAuthenticated ? (
  <div className="w-full flex lg:flex-row lg:gap-0 flex-col gap-3 lg:justify-between items-center">
    
    {/* Welcome Message on the Left */}
    <p className="text-lg font-semibold text-white bg-gray-800 px-4 py-2 rounded-lg shadow-md flex items-center space-x-2">
      <span className="text-white">Welcome,</span>
      <span className="text-blue-400">{user?.displayName || "User"}</span> {/* Use optional chaining */}
    </p>

    <button
      onClick={handleLogout}
      className="lg:hidden block lg:px-4 py-1 px-2 bg-red-500 hover:bg-red-700 text-white font-semibold rounded-md shadow-lg transition duration-300"
    >
      Logout
    </button>

    {/* Logout Button on the Right */}
    <button
      onClick={handleLogout}
      className="lg:block hidden ml-auto lg:px-4 py-1 px-1 bg-red-500 hover:bg-red-700 text-white font-semibold rounded-md shadow-lg transition duration-300"
    >
      Logout
    </button>
  </div>
) : (
  <div className="ml-auto flex space-x-4">
    <Link href="/signup">
      <button className="lg:px-4 py-2 px-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md shadow-lg transition duration-300">
        Sign up
      </button>
    </Link>
    <Link href="/login">
      <button className="lg:px-4 py-2 px-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-md shadow-lg transition duration-300">
        Login
      </button>
    </Link>
  </div>
)}

      </div>

      {/* Hero Section */}
      <section className="w-full max-w-7xl px-6 py-16 text-center relative lg:top-5 top-10 flex flex-col justify-center min-h-[75vh]">
        <div className="flex flex-col justify-center min-h-[200px] sm:min-h-[250px]">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6">
            <span className="block lg:inline min-h-[56px] sm:min-h-[72px]">
              <Typewriter
                words={['Welcome to', 'Start Chatting on']}
                cursor
                cursorStyle=""
                typeSpeed={80}
                deleteSpeed={50}
                delaySpeed={1500}
                loop
              />
            </span>{' '}
            <span className="text-blue-500">Randomly</span>
          </h1>
          <p className="text-lg sm:text-xl mb-8">
            Connect with random people from around the world. Start chatting now & enjoy!
          </p>
          <div className="relative">
            <button
              className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg rounded-full shadow-lg transition duration-300"
              onClick={handleStartNow} // Check authentication and redirect
            >
              Start Now
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-7xl px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative lg:-top-24 -top-[74px]">
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">Anonymous</h3>
          <p>Chat with complete anonymity and have fun by just signing up.</p>
        </div>
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">Instant Match</h3>
          <p>Get matched instantly with random users and start chatting right away.</p>
        </div>
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">Cross-platform</h3>
          <p>Works on any device, whether you are on mobile, tablet, or desktop.</p>
        </div>
      </section>
    </main>
    </>
  );
}