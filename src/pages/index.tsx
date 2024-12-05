import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        console.log("Starting authentication check...");
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get("email");
        console.log("Email from URL:", email);

        if (email) {
          console.log("Initializing user with email:", email);
          const response = await fetch("/api/initializeUser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          });

          const data = await response.json();
          console.log("Initialize user response:", data);

          if (data.success) {
            console.log("User initialized, redirecting to chat...");
            router.push("/chat");
          } else {
            console.log("Initialization failed, redirecting to splash...");
            setError("User initialization failed");
            window.location.href =
              "https://vgw-splash-page-frontend-71431835113b.herokuapp.com/";
          }
        } else {
          console.log("No email found, checking existing auth...");
          const authCheck = await fetch("/api/auth/check");
          const authData = await authCheck.json();

          if (authData.authenticated) {
            console.log("User authenticated, redirecting to chat...");
            router.push("/chat");
          } else {
            console.log("Not authenticated, redirecting to splash...");
            window.location.href = "https://newwingman.com";
          }
        }
      } catch (error) {
        console.error("Error during authentication check:", error);
        setError("Authentication check failed");
        window.location.href =
          "https://vgw-splash-page-frontend-71431835113b.herokuapp.com/";
      } finally {
        setLoading(false);
      }
    };

    checkUserAuth();
  }, [router]);

  if (error) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.error}>
            <h1>Error</h1>
            <p>{error}</p>
          </div>
        </main>
      </div>
    );
  }

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
