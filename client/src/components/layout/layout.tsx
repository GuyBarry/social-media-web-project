import { Navbar } from "../navbar/navbar";
import { AppContainer } from "./layout.styled";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppContainer>
      <Navbar />
      <main>{children}</main>
    </AppContainer>
  );
};