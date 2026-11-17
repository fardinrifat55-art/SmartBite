export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">404 - Page Not Found</h2>
        <p className="text-muted-foreground">The requested page does not exist.</p>
      </div>
    </div>
  );
}
