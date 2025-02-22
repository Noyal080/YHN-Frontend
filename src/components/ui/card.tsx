const Card = ({ children }: { children: ReactNode }) => (
  <div className="bg-white shadow-md rounded-lg p-4">{children}</div>
);

import { ReactNode } from "react";

const CardContent = ({ children }: { children: ReactNode }) => (
  <div className="p-2">{children}</div>
);

export { Card, CardContent };
