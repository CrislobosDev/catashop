"use client";

import { ReactNode } from "react";

type RouteTransitionProps = {
  children: ReactNode;
};

export default function RouteTransition({ children }: RouteTransitionProps) {
  return <div className="route-transition">{children}</div>;
}
