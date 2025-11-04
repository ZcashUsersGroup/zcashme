import React, { useEffect, useMemo, useState } from "react";
import ZcashAddressInput from "./ZcashAddressInput";
import ProfileEditor from "./ProfileEditor";
import { useFeedback } from "../store";

// Constants aligned with ZcashFeedback.jsx
const SIGNIN_ADDR =
  "u1qzt502u9fwh67s7an0e202c35mm0h534jaa648t4p2r6mhf30guxjjqwlkmvthahnz5myz2ev7neff5pmveh54xszv9njcmu5g2eent82ucpd3lwyzkmyrn6rytwsqefk475hl5tl4tu8yehc0z8w9fcf4zg6r03sq7lldx0uxph7c0lclnlc4qjwhu2v52dkvuntxr8tmpug3jntvm";
const MIN_SIGNIN_AMOUNT = 0.001;

// Lightweight copy of buildZcashEditMemo used for compact memo payloads
function buildCompactEditMemo(profile = {}, zid = "?", addr = "") {
  const fieldMap = { name: "n", bio: "b", profile_image_url: "i", links: "l" };
  const clean = Object.fromEntries(
    Object.entries(profile).filter(([_, v]) => {
      if (Array.isArray(v)) return v.some((x) => x && x.trim() !== "");
      return v !== "" && v !== null && v !== undefined;
    })
  );
  const includeAddress = "address" in clean && clean.address.trim() !== "";
  const compactPairs = Object.entries(clean)
    .filter(([k]) => k !== "address")
    .map(([key, value]) => {
      const shortKey = fieldMap[key] || key;
      if (Array.isArray(value)) {
        return `${shortKey}:[${value
          .filter((x) => x && x.trim() !== "")
          .map((x) => `"${x}"`)
          .join(",")}]`;
      }
      return `${shortKey}:"${value}"`;
    });
  const payload =
    compactPairs.length > 0 || includeAddress
      ? `{z:${zid}${includeAddress ? `,a:"${clean.address.trim()}"` : ""}${compactPairs.length ? `,${compactPairs.join(",")}` : ""}}`
      : `{z:${zid}}`;
  return payload;
}

// Backend placeholders (reserved interfaces)
async function apiCreateJoinSession(address) {
  // TODO: integrate Supabase or backend service
  return { sessionId: crypto.randomUUID(), address };
}
async function apiSubmitProfile(sessionId, profile) {
  // TODO: persist draft profile to backend
  return { ok: true, sessionId };
}
async function apiVerifyOtp(sessionId, code) {
  // TODO: verify the OTP sent via memo or backend
  return { ok: true, sessionId, verified: true };
}

export default function JoinModal({ isOpen, onClose }) {
  const { pendingEdits } = useFeedback();
  const [step, setStep] = useState(1); // 1 address, 2 profile, 3 verify
  const [address, setAddress] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setAddress("");
      setSessionId(null);
      setCopied(false);
    }
  }, [isOpen]);

  const isValidAddress = useMemo(() => {
    return typeof address === "string" && /^(u1|zs1|t1|tm)/.test(address);
  }, [address]);

  const memoText = useMemo(() => {
    const profile = { ...(pendingEdits?.profile || {}), links: pendingEdits?.l || [] };
    return buildCompactEditMemo(profile, "?", address);
  }, [pendingEdits?.profile, pendingEdits?.l, address]);

  const uri = useMemo(() => {
    const params = new URLSearchParams();
    params.set("address", SIGNIN_ADDR);
    params.set("amount", MIN_SIGNIN_AMOUNT.toFixed(3));
    // base64url encode
    const base64url = (str) => {
      const b64 = typeof window === "undefined"
        ? Buffer.from(str, "utf-8").toString("base64")
        : btoa(unescape(encodeURIComponent(str)));
      return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    };
    params.set("memo", base64url(memoText));
    return `zcash:?${params.toString()}`;
  }, [memoText]);

  const handleNextFromAddress = async () => {
    const res = await apiCreateJoinSession(address);
    setSessionId(res.sessionId);
    setStep(2);
  };

  const handleSubmitProfile = async () => {
    await apiSubmitProfile(sessionId, { ...(pendingEdits?.profile || {}), links: pendingEdits?.l || [] });
    setStep(3);
  };

  const handleCopyUri = async () => {
    try {
      await navigator.clipboard.writeText(uri);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  const handleOpenWallet = () => {
    window.open(uri, "_blank");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-[92%] max-w-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white text-xs font-bold">+
            </span>
            <h3 className="font-semibold">Join Zecbook.com</h3>
          </div>
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose} aria-label="Close">Close</button>
        </div>

        {/* Steps indicator */}
        <div className="px-4 pt-2">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
            <span className={`px-2 py-1 rounded-full ${step===1?"bg-blue-600 text-white":"bg-gray-100"}`}>1 Address</span>
            <span>→</span>
            <span className={`px-2 py-1 rounded-full ${step===2?"bg-blue-600 text-white":"bg-gray-100"}`}>2 Profile</span>
            <span>→</span>
            <span className={`px-2 py-1 rounded-full ${step===3?"bg-blue-600 text-white":"bg-gray-100"}`}>3 Verify</span>
          </div>
        </div>

        {/* Body */}
        <div className="px-4 py-3">
          {step === 1 && (
            <div className="space-y-3">
              <ZcashAddressInput value={address} onChange={setAddress} label="Your Zcash Address" id="join-addr" />
              <div className="flex items-center justify-end gap-2">
                <button className="px-3 py-2 text-sm rounded-xl border border-gray-300" onClick={onClose}>Cancel</button>
                <button
                  className={`px-3 py-2 text-sm rounded-xl ${isValidAddress?"bg-blue-600 text-white":"bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                  onClick={handleNextFromAddress}
                  disabled={!isValidAddress}
                >Next</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Complete your profile (name, bio, profile image, links). These changes will be packed into the verification memo.</p>
              <ProfileEditor profile={{ address: "", name: "", bio: "", profile_image_url: "", links: [] }} initialValues={{ address }} compact readOnlyAddress />
              <div className="flex items-center justify-between">
                <button className="px-3 py-2 text-sm rounded-xl border border-gray-300" onClick={() => setStep(1)}>Back</button>
                <button className="px-3 py-2 text-sm rounded-xl bg-blue-600 text-white" onClick={handleSubmitProfile}>Continue Verification</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-700">Open your wallet, send ≥{MIN_SIGNIN_AMOUNT} ZEC to the system address, and send the memo below exactly as it is to complete verification.</p>
              <div className="rounded-xl border px-3 py-2 bg-gray-50">
                <pre className="whitespace-pre-wrap break-words text-sm font-mono text-gray-800">{memoText}</pre>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleCopyUri} className={`px-3 py-2 text-sm rounded-xl border ${copied?"border-green-500 text-green-600 bg-green-50":"border-gray-500 text-gray-700"}`}>{copied?"Copied":"Copy URI"}</button>
                <button onClick={handleOpenWallet} className="px-3 py-2 text-sm rounded-xl bg-blue-600 text-white">Open in Wallet</button>
              </div>
              <p className="text-xs text-gray-500">System Address: <span className="font-mono">{SIGNIN_ADDR.slice(0,8)}…{SIGNIN_ADDR.slice(-8)}</span></p>
              <div className="flex items-center justify-between">
                <button className="px-3 py-2 text-sm rounded-xl border border-gray-300" onClick={() => setStep(2)}>Back to Profile</button>
                <button className="px-3 py-2 text-sm rounded-xl border border-gray-300" onClick={onClose}>Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}