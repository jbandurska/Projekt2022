import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    // Przy okazji upewniamy się, że żadne nie zostały nam żadne modale z poprzedniej strony
    const modalRoot = document.getElementById("modal")!;
    const body = document.querySelector("body")!;
    modalRoot.style.display = "none";
    body.style.position = "relative";
  }, [pathname]);

  return null;
}
