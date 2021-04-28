import React from "react";
import Link from "next/link";

export default function NavLink(props) {
  return (
    <Link href={props.href} passHref>
      <a className={props.className}>
        {props.children ? props.children : props.text}
      </a>
    </Link>
  );
}
