const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col items-center h-full min-h-screen min-w-screen justify-center">
      {children}
    </div>
  );
};

export default layout;
