import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const Modal = ({ children, div }) => {
  const elRef = useRef(null);
  if (!elRef.current) {
    elRef.current = document.createElement("div");
  }

  useEffect(() => {
    const modalRoot = document.getElementById(div);
    const body = document.querySelector("body");

    modalRoot.appendChild(elRef.current);
    modalRoot.style.display = "flex";
    body.style.overflow = "hidden";
    return () => {
      modalRoot.removeChild(elRef.current);
      modalRoot.style.display = "none";
      body.style.overflow = "auto";
    };
  }, [div]);

  return createPortal(<div>{children}</div>, elRef.current);
};

export default Modal;
