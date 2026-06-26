import { AlertCircle, Wallet } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";

interface WalletConnectStateProps {
  isConnecting: boolean;
  onClick?: () => void;
  className?: string;
}

export function WalletConnectState({ isConnecting, onClick, className }: WalletConnectStateProps) {
  return (
    <button
      onClick={onClick}
      disabled={isConnecting}
      className={cn(
        "inline-flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200",
        "bg-[#2DD4BF] text-[#0F0F14] hover:shadow-[0_4px_16px_-4px_rgba(185,255,102,0.6)] active:scale-95",
        "disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100",
        className
      )}
    >
      {isConnecting ? (
        <>
          <Spinner size={15} className="text-[#0F0F14]" />
          Connecting…
        </>
      ) : (
        <>
          <Wallet size={15} />
          Connect Wallet
        </>
      )}
    </button>
  );
}

interface FreighterInstallStateProps {
  className?: string;
}

export function FreighterInstallState({ className }: FreighterInstallStateProps) {
  return (
    <a
      href="https://freighter.app"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold",
        "bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 transition-colors",
        className
      )}
    >
      <AlertCircle size={14} />
      Install Freighter
    </a>
  );
}
