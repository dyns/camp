export function PageContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-2xl mx-auto p-4 bg-white mt-4 rounded-lg shadow-[2px_2px_0_#222]">
      {children}
    </div>
  );
}
