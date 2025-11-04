// src/components/ReplyBox.jsx
import React, { useMemo, useState } from "react";

function toBase64Url(str = "") {
  try {
    return btoa(unescape(encodeURIComponent(str)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  } catch {
    return "";
  }
}

function byteCount(text = "") {
  try {
    const raw = new TextEncoder().encode(text).length;
    const encoded = Math.ceil((raw / 3) * 4);
    const remaining = 512 - encoded;
    return { raw, encoded, remaining };
  } catch {
    return { raw: text.length, encoded: text.length, remaining: 512 - text.length };
  }
}

export default function ReplyBox({ replyAddress = "", placeholder = "write a reply" }) {
  const [mode, setMode] = useState("draft"); // draft | verify
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [copied, setCopied] = useState(false);

  const memoBytes = useMemo(() => byteCount(text), [text]);

  const uri = useMemo(() => {
    const params = new URLSearchParams();
    params.set("address", replyAddress || "u1example...mock");
    if (amount && Number(amount) > 0) params.set("amount", Number(amount).toFixed(3));
    const memo = text.trim() ? toBase64Url(text.trim()) : toBase64Url("note:{}");
    params.set("memo", memo);
    return `zcash:?${params.toString()}`;
  }, [replyAddress, amount, text]);

  const copyURI = async () => {
    try {
      await navigator.clipboard.writeText(uri);
      setCopied(true); setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="mt-4">
      {/* Mode pills */}
      <div className="inline-flex rounded-full overflow-hidden border border-gray-300 bg-white/60">
        <button
          className={`px-3 py-1 text-sm ${mode === "draft" ? "bg-blue-600 text-white" : "text-gray-700"}`}
          onClick={() => setMode("draft")}
        >
          Draft
        </button>
        <button
          className={`px-3 py-1 text-sm ${mode === "verify" ? "bg-green-600 text-white" : "text-gray-700"}`}
          onClick={() => setMode("verify")}
        >
          Verify
        </button>
      </div>

      {/* Input fields */}
      <div className="mt-3 space-y-2">
        <input
          type="text"
          defaultValue={replyAddress}
          readOnly
          className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white/50"
        />
        <input
          type="text"
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white/70"
        />
        <p className={`text-xs text-right ${memoBytes.remaining < 0 ? "text-red-600" : "text-gray-500"}`}>
          {memoBytes.remaining >= 0 ? `+${memoBytes.remaining} bytes` : `-${Math.abs(memoBytes.remaining)} over 512`}
        </p>
        <input
          type="text"
          placeholder="0.0000 ZEC (optional)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white/50"
        />
      </div>

      {/* Actions */}
      <div className="mt-3 flex flex-wrap gap-2">
        <button className="px-3 py-2 rounded-lg border bg-white/70" onClick={copyURI}>
          {copied ? "Copied" : "📋 Copy URI"}
        </button>
        <a className="px-3 py-2 rounded-lg border bg-white/70" href={uri} target="_blank" rel="noreferrer">
          🔗 Open in Wallet
        </a>
      </div>
    </div>
  );
}