import type { ComponentProps } from "react";

export const Link = (props: ComponentProps<"a">) => {
  const { children, href, ...rest } = props;
  const isExternal = typeof href === "string" && /^https?:\/\//.test(href);

  return (
    <a
      className="sbdocs-a"
      href={href}
      target={isExternal ? "_blank" : undefined}
      {...rest}
    >
      {children}
    </a>
  );
};
