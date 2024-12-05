import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        // Check if user is coming from splash page
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get("email");

        if (email) {
          // Initialize user if coming from splash page
          const response = await fetch("/api/initializeUser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          });

          const data = await response.json();

          if (data.success) {
            router.push("/chat"); // Redirect to chat interface
          } else {
            window.location.href = "https://newwingman.com"; // Redirect to splash page if initialization fails
          }
        } else {
          // If no email parameter, check if user is already authenticated
          const authCheck = await fetch("/api/auth/check");
          const authData = await authCheck.json();

          if (authData.authenticated) {
            router.push("/chat");
          } else {
            window.location.href = "https://newwingman.com";
          }
        }
      } catch (error) {
        console.error("Error during authentication check:", error);
        window.location.href = "https://newwingman.com";
      } finally {
        setLoading(false);
      }
    };

    checkUserAuth();
  }, [router]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {loading ? (
          <div className={styles.loading}>
            <h1>Loading Video Game Wingman...</h1>
            <div className={styles.spinner}></div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
