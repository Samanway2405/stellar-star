import { motion } from "framer-motion";
import { Check, Copy, ExternalLink, LogOut, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { STELLAR_EXPLORER } from "@/lib/utils/constants";
import { formatAddress, formatXLM } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { NetworkBadge } from "@/components/wallet/NetworkBadge";

interface WalletDropdownProps {
  publicKey: string;
  balance: string | null;
  network: string | null;
  isLoadingBalance: boolean;
  onRefreshBalance: () => void;
  onDisconnect: () => void;
  onClose: () => void;
}

export function WalletDropdown({
  publicKey,
  balance,
  network,
  isLoadingBalance,
  onRefreshBalance,
  onDisconnect,
  onClose,
}: WalletDropdownProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(publicKey).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const explorerUrl = `${STELLAR_EXPLORER}/account/${publicKey}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl border border-[#E5E5E5] shadow-[0_8px_40px_-8px_rgba(0,0,0,0.15)] overflow-hidden z-[100]"
    >
      <div className="px-4 py-3 bg-[#F6F6F6] border-b border-[#E5E5E5]">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#AAA]">
            Connected Wallet
          </p>
          <NetworkBadge network={network} />
        </div>

        <div className="flex items-center gap-2">
          <p className="text-sm font-mono font-semibold text-[#0F0F14] flex-1 truncate">
            {formatAddress(publicKey, 8)}
          </p>
          <button
            onClick={handleCopy}
            className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-[#E5E5E5] transition-colors"
            title="Copy address"
          >
            {copied ? (
              <Check size={13} className="text-[#134E4A]" />
            ) : (
              <Copy size={13} className="text-[#888]" />
            )}
          </button>
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-[#E5E5E5] transition-colors"
            title="View on Stellar Explorer"
          >
            <ExternalLink size={13} className="text-[#888]" />
          </a>
        </div>
      </div>

      <div className="px-4 py-3 border-b border-[#E5E5E5]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] text-[#AAA] font-medium mb-0.5">XLM Balance</p>
            {isLoadingBalance ? (
              <Spinner size={14} className="text-[#2DD4BF]" />
            ) : (
              <p className="text-lg font-black text-[#0F0F14]">
                {balance ? `${formatXLM(balance)} XLM` : "—"}
              </p>
            )}
          </div>
          <button
            onClick={onRefreshBalance}
            disabled={isLoadingBalance}
            className="flex items-center justify-center w-8 h-8 rounded-xl hover:bg-[#F0F0F0] transition-colors disabled:opacity-40"
            title="Refresh balance"
          >
            <RefreshCw
              size={14}
              className={cn("text-[#888]", isLoadingBalance && "animate-spin")}
            />
          </button>
        </div>
      </div>

      <div className="p-2">
        <button
          onClick={() => {
            onDisconnect();
            onClose();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-500 rounded-xl hover:bg-red-50 transition-colors"
        >
          <LogOut size={15} />
          Disconnect Wallet
        </button>
      </div>
    </motion.div>
  );
}
