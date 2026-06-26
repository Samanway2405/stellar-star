import { render, screen } from "@testing-library/react";
import { NetworkBadge } from "@/components/wallet/NetworkBadge";

describe("NetworkBadge", () => {
  it("renders the mainnet label for public networks", () => {
    render(<NetworkBadge network="PUBLIC" />);

    expect(screen.getByText("Mainnet")).toBeTruthy();
  });

  it("renders the testnet label for non-public networks", () => {
    render(<NetworkBadge network="TESTNET" />);

    expect(screen.getByText("Testnet")).toBeTruthy();
  });
});
