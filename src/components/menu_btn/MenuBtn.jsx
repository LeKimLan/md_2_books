import React, { useRef } from "react";
import "./menu-btn.scss";
export default function MenuBtn({open, onClickFn}) {
  const btnRef = useRef();
  return (
    <div onClick={() => {
      onClickFn(!open)
    }} className={`menu-btn ${open ? "" : "open"}`}>
      <div ref={btnRef} className="menu-btn__burger"></div>
    </div>
  );
}