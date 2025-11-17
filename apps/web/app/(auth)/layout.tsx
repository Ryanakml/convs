import { AuthLayout } from "@/modules/auth/ui/layouts/auth-layouts";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <AuthLayout>{children}</AuthLayout>;
};

export default layout;
