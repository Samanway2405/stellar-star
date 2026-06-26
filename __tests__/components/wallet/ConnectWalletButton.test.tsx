import { render, screen, fireEvent } from "@testing-library/react";
import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton";

const connect = jest.fn();
const disconnect = jest.fn();
const clearError = jest.fn();

jest.mock("@/hooks/useWallet", () => ({
  useWallet: () => ({
    publicKey: null,
    balance: null,
    network: "TESTNET",
    isConnected: false,
    isConnecting: false,
    isLoadingBalance: false,
    error: null,
    connect,
    disconnect,
    refreshBalance: jest.fn(),
    clearError,
  }),
}));

describe("ConnectWalletButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a connect action for a disconnected wallet", () => {
    render(<ConnectWalletButton />);

    expect(screen.getByRole("button", { name: /connect wallet/i })).toBeTruthy();
  });

  it("invokes connect when the user presses the button", () => {
    render(<ConnectWalletButton />);

    fireEvent.click(screen.getByRole("button", { name: /connect wallet/i }));

    expect(connect).toHaveBeenCalledTimes(1);
  });
});
