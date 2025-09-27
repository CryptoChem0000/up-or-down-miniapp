"use client";

import Image from "next/image";
import Link from "next/link";

type HeroHeaderProps = {
  iconSrc?: string; // "/eth-mark-tight-20.png" (served inside a 32px chip)
  title?: string;   // "ETHEREUM"
  subtitle?: string;// "Will ETH price go up or down today?"
  pillHref?: string;// "/rules" or "#" for now
  pillText?: string;// "Vote closes at midnight UTC" - if undefined, pill is hidden
};

export default function HeroHeader({
  iconSrc = "/eth-mark-tight-20.png",
  title = "ETHEREUM",
  subtitle = "Will ETH price go up or down today?",
  pillHref = "#",
  pillText = "Vote closes at midnight UTC",
}: HeroHeaderProps) {
  return (
    <div className="w-full flex flex-col items-center text-center">
      <div className="flex items-center justify-center">
        {/* 32px chip; swap to your new icon if desired */}
        <Image
          src={iconSrc}
          alt="App icon"
          width={32}
          height={32}
          className="rounded-full"
          priority
        />
      </div>

      <div className="mt-3 space-y-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">{title}</h1>

        <p className="mx-auto max-w-[30ch] sm:max-w-[36ch] text-sm text-gray-400 leading-relaxed">
          {subtitle}
        </p>

        {pillText && (
          <div className="flex justify-center">
            <Link
              href={pillHref}
              className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/15"
            >
              {pillText}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
