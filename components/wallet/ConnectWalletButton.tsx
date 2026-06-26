"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ChevronDown, LogOut, Wallet } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { Spinner } from "@/components/ui/Spinner";
import { formatAddress, formatXLM } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { WalletDropdown } from "@/components/wallet/WalletDropdown";
import { FreighterInstallState, WalletConnectState } from "@/components/wallet/WalletConnectState";

interface ConnectWalletButtonProps {
  /** Compact mode for mobile menus — shows text only, no balance */
  compact?: boolean;
  className?: string;
}

export function ConnectWalletButton({
  compact = false,
  className,
}: ConnectWalletButtonProps) {
  const {
    publicKey,
    balance,
    network,
    isConnected,
    isConnecting,
    isLoadingBalance,
    error,
    connect,
    disconnect,
    refreshBalance,
    clearError,
  } = useWallet();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [freighterMissing, setFreighterMissing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Check Freighter on mount
  useEffect(() => {
    import("@/lib/freighter").then(({ isFreighterInstalled }) => {
      isFreighterInstalled().then((installed) => {
        if (!installed) setFreighterMissing(true);
      });
    });
  }, []);

  // ── Not installed ──────────────────────────────────────────────────────────

  if (freighterMissing && !isConnected) {
    return <FreighterInstallState className={className} />;
  }

  // ── Connected ──────────────────────────────────────────────────────────────

  if (isConnected && publicKey) {
    if (compact) {
      return (
        <div className={cn("flex flex-col gap-1.5", className)}>
          <div className="flex items-center gap-2 px-3 py-2 bg-[#F6F6F6] rounded-xl border border-[#E5E5E5]">
            <div className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-pulse" />
            <span className="text-sm font-mono font-medium text-[#0F0F14] flex-1 truncate">
              {formatAddress(publicKey, 6)}
            </span>
            {balance && (
              <span className="text-xs font-semibold text-[#134E4A]">
                {formatXLM(balance)} XLM
              </span>
            )}
          </div>
          <button
            onClick={disconnect}
            className="w-full px-3 py-2 text-sm font-medium text-red-500 rounded-xl border border-red-100 hover:bg-red-50 transition-colors text-left flex items-center gap-2"
          >
            <LogOut size={14} />
            Disconnect
          </button>
        </div>
      );
    }

    return (
      <div ref={ref} className={cn("relative", className)}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className={cn(
            "inline-flex items-center gap-2 pl-1 pr-2 sm:pr-3 py-1.5 rounded-xl border transition-all duration-200 max-w-[180px] sm:max-w-none",
            "bg-white border-[#E5E5E5] hover:border-[#2DD4BF]/60 hover:shadow-[0_2px_12px_-2px_rgba(185,255,102,0.3)]"
          )}
        >
          {/* Avatar dot */}
          <div className="w-7 h-7 rounded-lg bg-[#2DD4BF] flex items-center justify-center">
            <Wallet size={13} className="text-[#0F0F14]" />
          </div>

          {/* Address */}
          <div className="hidden sm:block text-left">
            <p className="text-[11px] text-[#AAA] leading-none mb-0.5">Connected</p>
            <p className="text-xs font-mono font-semibold text-[#0F0F14] leading-none">
              {formatAddress(publicKey, 5)}
            </p>
          </div>

          <span className="sm:hidden inline-flex items-center w-2 h-2 rounded-full bg-[#134E4A]" />

          {/* Balance pill */}
          {!isLoadingBalance && balance && (
            <span className="hidden sm:flex items-center text-[11px] font-bold text-[#134E4A] bg-[#2DD4BF]/15 px-2 py-0.5 rounded-lg">
              {formatXLM(balance)} XLM
            </span>
          )}
          {isLoadingBalance && (
            <Spinner size={12} className="text-[#2DD4BF]" />
          )}

          <ChevronDown
            size={13}
            className={cn(
              "text-[#AAA] transition-transform duration-200 shrink-0",
              dropdownOpen && "rotate-180"
            )}
          />
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <WalletDropdown
              publicKey={publicKey}
              balance={balance}
              network={network}
              isLoadingBalance={isLoadingBalance}
              onRefreshBalance={refreshBalance}
              onDisconnect={disconnect}
              onClose={() => setDropdownOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────

  if (error) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <span className="text-xs text-red-500 max-w-[160px] truncate">{error}</span>
        <button
          onClick={() => { clearError(); connect(); }}
          className="text-xs font-semibold text-[#0F0F14] underline"
        >
          Retry
        </button>
      </div>
    );
  }

  // ── Default: connect button ────────────────────────────────────────────────

  return <WalletConnectState isConnecting={isConnecting} onClick={connect} className={className} />;
}
