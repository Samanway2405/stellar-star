import { cn } from "@/lib/utils";

interface NetworkBadgeProps {
  network: string | null;
}

export function NetworkBadge({ network }: NetworkBadgeProps) {
  const isMainnet = network === "PUBLIC";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md",
        isMainnet
          ? "bg-blue-100 text-blue-600"
          : "bg-[#2DD4BF]/20 text-[#134E4A]"
      )}
    >
      <span
        className={cn(
          "w-1 h-1 rounded-full",
          isMainnet ? "bg-blue-600" : "bg-[#134E4A] animate-pulse"
        )}
      />
      {isMainnet ? "Mainnet" : "Testnet"}
    </span>
  );
}
