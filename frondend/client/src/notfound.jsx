import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1 style={styles.code}>404</h1>
        <h2 style={styles.title}>Page Not Found</h2>
        <p style={styles.text}>
          The page you are looking for doesn’t exist or has been moved.
        </p>

        <Link to="/" style={styles.button}>
          Go Home
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    color: "white",
    fontFamily: "Arial",
  },
  box: {
    textAlign: "center",
    padding: "30px",
  },
  code: {
    fontSize: "80px",
    margin: "0",
    color: "#38bdf8",
  },
  title: {
    fontSize: "28px",
    margin: "10px 0",
  },
  text: {
    color: "#94a3b8",
    marginBottom: "20px",
  },
  button: {
    display: "inline-block",
    padding: "10px 20px",
    background: "#38bdf8",
    color: "#0f172a",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
  },
};