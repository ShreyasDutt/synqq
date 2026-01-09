"use client";

import type { ReactNode } from "react";
import { Provider as JotaiProvider } from "jotai";

type Props = {
  children: ReactNode;
};

export function JotaiRootProvider({ children }: Props) {
  return <JotaiProvider>{children}</JotaiProvider>;
}
