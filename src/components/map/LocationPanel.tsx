
"use client";

import type { FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowLeft,
  Keyboard,
  LocateFixed,
  Search,
} from "lucide-react";

type LocationPanelProps = {
  addressOpen: boolean;
  address: string;
  isSearchingAddress: boolean;
  addressError: string;
  gpsError: boolean;

  onGpsClick: () => void;
  onAddressOpen: () => void;
  onAddressClose: () => void;
  onAddressChange: (value: string) => void;
  onAddressSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function LocationPanel({
  addressOpen,
  address,
  isSearchingAddress,
  addressError,
  gpsError,
  onGpsClick,
  onAddressOpen,
  onAddressClose,
  onAddressChange,
  onAddressSubmit,
}: LocationPanelProps) {
  const t = useTranslations("Map");
  const locale = useLocale();

  return (
    <div
      className="
        absolute inset-x-0 bottom-0 z-10
        border-y border-amber-400/50
        bg-slate-950/25 px-3 py-1.5
        text-white backdrop-blur-md
        shadow-[0_-6px_24px_rgba(0,0,0,0.25)]
      "
    >
      <div className="mx-auto w-full max-w-xl">
        {/* Naslov + uputa za pin */}
        <div
          dir="ltr"
          className="
            mb-1 flex flex-col gap-0.5
            min-[336px]:flex-row
            min-[336px]:items-start
            min-[336px]:justify-between
            min-[336px]:gap-2
          "
        >
          <p
            dir={locale === "ar" ? "rtl" : "ltr"}
            className={`
              shrink-0 whitespace-nowrap
              text-[10px] font-bold tracking-wide text-amber-400
              ${
                locale === "ar"
                  ? "self-end min-[336px]:order-2"
                  : "self-start"
              }
            `}
          >
            {t("title")}
          </p>

          <div
            dir="ltr"
            className={`
              flex min-w-0 max-w-full items-start gap-1
              text-[11px] font-semibold leading-snug text-slate-100
              ${
                locale === "ar"
                  ? "self-end min-[336px]:order-1 min-[336px]:self-start"
                  : "self-start"
              }
            `}
          >
            
{/* Mini verzija korisnikovog amber/cijan pina */}
<svg
  width="12"
  height="13"
  viewBox="0 0 44 62"
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
  className="shrink-0"
>
  <defs>
    <linearGradient
      id="panel-pin-amber"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop offset="0%" stopColor="#f59e0b" />
      <stop offset="100%" stopColor="#d97706" />
    </linearGradient>
  </defs>

  <path
    d="M22 2 C11 2 3 10 3 21
       C3 35 22 58 22 58
       S41 35 41 21
       C41 10 33 2 22 2Z"
    fill="url(#panel-pin-amber)"
    stroke="#06b6d4"
    strokeWidth="1.5"
  />

  <circle cx="22" cy="21" r="11" fill="#082032" />

  <circle
    cx="22"
    cy="21"
    r="8"
    fill="#0891b2"
    stroke="#22d3ee"
    strokeWidth="1"
  />
</svg>


            <span
              dir={locale === "ar" ? "rtl" : "ltr"}
              className="min-w-0 whitespace-normal"
            >
              {t("pinHint")}
            </span>
          </div>
        </div>

        {/* Unos adrese ili dva glavna gumba */}
        {addressOpen ? (
          <form
            onSubmit={onAddressSubmit}
            className="flex items-center gap-1.5"
          >
            <button
              type="button"
              onClick={onAddressClose}
              aria-label={t("back")}
              className="
                flex h-8 w-8 shrink-0
                items-center justify-center
                rounded-md border border-amber-500/30
                bg-slate-950/25
              "
            >
              <ArrowLeft size={15} />
            </button>

            <input
              type="search"
              value={address}
              onChange={(event) =>
                onAddressChange(event.target.value)
              }
              placeholder={t("addressPlaceholder")}
              aria-label={t("addressPlaceholder")}
              className="
                h-8 min-w-0 flex-1
                rounded-md border border-amber-500/30
                bg-slate-950/25 px-2
                text-base text-white
                placeholder:text-slate-400
                outline-none focus:border-amber-400
                sm:text-sm
              "
            />

            <button
              type="submit"
              disabled={isSearchingAddress}
              aria-label={t("useAddress")}
              className="
                flex h-8 w-8 shrink-0
                items-center justify-center
                rounded-md border border-amber-500/50
                bg-amber-500/15 text-amber-400
                disabled:opacity-50
              "
            >
              {isSearchingAddress ? (
                <span className="text-xs">...</span>
              ) : (
                <Search size={16} />
              )}
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onGpsClick}
              className="
                flex h-8 min-w-0
                items-center justify-center gap-1.5
                rounded-md border border-cyan-500/40
                bg-slate-950/25 px-2
                text-xs font-semibold text-cyan-300
                transition-colors hover:bg-cyan-500/15
              "
            >
              <LocateFixed
                size={14}
                className="shrink-0 text-cyan-400"
              />

              {t("gps")}
            </button>

            <button
              type="button"
              onClick={onAddressOpen}
              className="
                flex h-8 min-w-0
                items-center justify-center gap-1.5
                rounded-md border border-amber-500/40
                bg-slate-950/25 px-2
                text-xs font-semibold text-amber-300
                transition-colors hover:bg-amber-500/15
              "
            >
              <Keyboard
                size={14}
                className="shrink-0 text-amber-400"
              />

              {t("useAddress")}
            </button>
          </div>
        )}

        {/* GPS greška */}
        {gpsError && (
          <p className="mt-1 text-[10px] text-red-300">
            {t("gpsError")}
          </p>
        )}

        {/* Greška pri pretraživanju adrese */}
        {addressError && (
          <p className="mt-1 text-[10px] text-red-300">
            {addressError}
          </p>
        )}
      </div>
    </div>
  );
}
