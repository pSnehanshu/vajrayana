import React from "react";

interface JSONViewProps extends React.HTMLAttributes<HTMLPreElement> {
  data: unknown;
}

export function JSONView({ data, ...props }: JSONViewProps) {
  return <pre {...props}>{JSON.stringify(data, null, 2)}</pre>;
}
