import { useState } from "react";

export const setNewPath = (currentPath: string) => {
  const pathArray = currentPath.split("/");
  const newPath = pathArray.slice(0, pathArray.length - 1).join("/") || "/";

  return newPath;
};

export const handlePaginatedItems = <T>({
  items,
  itemPerPage = 5,
}: {
  items: Array<T>;
  itemPerPage?: number;
  currentTopicId?: string[] | null;
}) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(items.length / itemPerPage);
  const currentItems = items.slice((page - 1) * itemPerPage, page * itemPerPage);

  return {
    page,
    setPage,
    totalPages,
    currentItems,
  };
};

export const handleNavMenu = () => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return { anchorElNav, handleOpenNavMenu, handleCloseNavMenu };
};

export const getElementHeight = (styles: CSSModuleClasses, elClass: any) => {
  const el = document.querySelectorAll(elClass);

  const recalculateHeight = () => {
    el.forEach((item) => {
      let boxEl = item.querySelector("div") as HTMLElement;
      let bulletEl = item.querySelector(`.${styles["list__item--bullet"]}`) as HTMLElement;

      if (boxEl && bulletEl) {
        let height = boxEl.clientHeight;
        bulletEl.style.height = `${height}px`;
      }
    });
  };

  // Recalculate height on window resize
  window.addEventListener("resize", recalculateHeight);
  // Initial calculation
  recalculateHeight();

  window.removeEventListener("resize", recalculateHeight);
};
