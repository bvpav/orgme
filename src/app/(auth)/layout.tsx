export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-[70vh] w-full flex-1 flex-col items-center justify-center px-20 text-center">
      {children}
    </main>
  );
}
