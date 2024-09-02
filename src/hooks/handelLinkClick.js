export const handleLinkClick = (event, path) => {
  if (isFirstClick) {
    event.preventDefault();
    setIsFirstClick(false);
    window.location.href = path; // Force un rechargement complet de la page
  }
};
