"use client";

import React, { useState } from "react";
import { User } from "@/types";
import { X, LogIn, UserPlus, LogOut, CheckCircle, AlertCircle, Shield } from "lucide-react";

interface AuthModalProps {
  currentUser: User | null;
  onClose: () => void;
  onAuthSuccess: (user: User, token: string) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  currentUser,
  onClose,
  onAuthSuccess,
  onLogout,
}) => {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const endpoint = tab === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload = tab === "login" ? { email, password } : { name, email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Authentication failed");
      }

      localStorage.setItem("kinematiq_token", data.token);
      localStorage.setItem("kinematiq_user", JSON.stringify(data.user));

      onAuthSuccess(data.user, data.token);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-3xl bg-[#0F1624] border border-[#1E2B42] p-6 shadow-2xl relative flex flex-col gap-4 animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {currentUser ? (
          /* USER LOGGED IN VIEW */
          <div className="flex flex-col items-center text-center gap-3 py-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center text-2xl font-display font-black shadow-lg">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <h3 className="text-xl font-display font-bold uppercase tracking-wide text-white">
                {currentUser.name}
              </h3>
              <p className="text-xs text-slate-400">{currentUser.email}</p>
            </div>

            <div className="w-full p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center gap-2 font-display font-bold uppercase tracking-wider">
              <CheckCircle className="w-4 h-4" />
              <span>CLOUD MONGODB SYNC ACTIVE</span>
            </div>

            <button
              onClick={onLogout}
              className="w-full py-3 rounded-xl bg-[#162033] border border-[#1E2B42] text-red-400 font-display font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 hover:bg-red-500/10 transition-colors mt-2"
            >
              <LogOut className="w-4 h-4" />
              <span>SIGN OUT</span>
            </button>
          </div>
        ) : (
          /* LOGIN & REGISTER FORMS */
          <>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-display font-bold uppercase tracking-wide text-white">
                  {tab === "login" ? "SIGN IN // ATHLETE" : "CREATE ATHLETE PROFILE"}
                </h3>
                <p className="text-[11px] text-slate-400">
                  Sync all workouts directly to MongoDB Atlas
                </p>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex rounded-xl bg-[#162033] p-1 border border-[#1E2B42]">
              <button
                type="button"
                onClick={() => {
                  setTab("login");
                  setError(null);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-display font-bold uppercase tracking-wider transition-all ${
                  tab === "login"
                    ? "bg-[#0F1624] text-white shadow-sm"
                    : "text-slate-400"
                }`}
              >
                SIGN IN
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab("register");
                  setError(null);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-display font-bold uppercase tracking-wider transition-all ${
                  tab === "register"
                    ? "bg-[#0F1624] text-white shadow-sm"
                    : "text-slate-400"
                }`}
              >
                REGISTER
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {tab === "register" && (
                <div>
                  <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-slate-400 mb-1">
                    ATHLETE NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Hunter"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#162033] border border-[#1E2B42] text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-slate-400 mb-1">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="athlete@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#162033] border border-[#1E2B42] text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-slate-400 mb-1">
                  PASSWORD
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#162033] border border-[#1E2B42] text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 mt-1 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-display font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-xl shadow-orange-500/25 active:scale-[0.98] transition-transform disabled:opacity-50"
              >
                {isLoading ? (
                  <span>AUTHENTICATING...</span>
                ) : tab === "login" ? (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>SIGN IN</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>CREATE ACCOUNT</span>
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
