document.addEventListener("keydown", (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
    return;
  }

  const region = event.target.closest(
    ".hdrl-table-scroll[tabindex], .hdrl-report-table-wrapper[tabindex]"
  );
  if (!region || region.scrollWidth <= region.clientWidth) {
    return;
  }

  const step = Math.max(48, Math.round(region.clientWidth * 0.2));
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    region.scrollLeft -= step;
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    region.scrollLeft += step;
  } else if (event.key === "Home") {
    event.preventDefault();
    region.scrollLeft = 0;
  } else if (event.key === "End") {
    event.preventDefault();
    region.scrollLeft = region.scrollWidth;
  }
});
