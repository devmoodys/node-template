import React from "react";
import Status from "ui/components/routing/Status";

export default function NotFound() {
  return (
    <Status code={404}>
      <div>Not found</div>
    </Status>
  );
}
