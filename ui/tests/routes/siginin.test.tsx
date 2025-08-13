import { expect, test } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { createRoutesStub } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import LoginPage from "~/routes/login";
import nock from "nock";
import { API_URL } from "../setup";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

test("renders the component", async () => {
  nock(API_URL).post("/auth/signin").replyWithError("Invalid credentials");

  const Stub = createRoutesStub([
    {
      path: "/",
      Component: LoginPage,
      action() {
        return {};
      },
    },
  ]);

  render(<Stub initialEntries={["/"]} />, { wrapper });

  const email = screen.getByLabelText<HTMLInputElement>("Email", {
    selector: "input",
  });

  await userEvent.type(email, "test@test.com");

  const password = screen.getByLabelText<HTMLInputElement>("Password", {
    selector: "input",
  });

  await userEvent.type(password, "password");

  const submit = screen.getByRole("button", { name: "Sign In" });

  await userEvent.click(submit);

  await waitFor(() => {
    expect(
      screen.getByText("Error logging in: Invalid credentials")
    ).toBeInTheDocument();
  });

  screen.debug();
});
