import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="es">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          backgroundColor: "#faf7f2",
          color: "#2e2a26",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h1 style={{ fontSize: "2rem" }}>Página no encontrada</h1>
        <Link href="/es" style={{ color: "#a34a2a", textDecoration: "underline" }}>
          Volver al inicio
        </Link>
      </body>
    </html>
  );
}
