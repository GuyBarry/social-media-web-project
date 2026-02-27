import { Navbar } from "../navbar/navbar";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="app-container">
      <Navbar />
      <main>{children}</main>
    </div>
  );
};