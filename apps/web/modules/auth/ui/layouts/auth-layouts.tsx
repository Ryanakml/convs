export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col items-center h-full min-h-screen min-w-full justify-center">
      {children}
    </div>
  );
};
