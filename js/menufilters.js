
function applyFilters() {
  const codeFilter = document.getElementById("filter-code").value.toLowerCase();
  const naamFilter = document.getElementById("filter-naam").value.toLowerCase();

  const isAnyFilterActive = codeFilter || naamFilter;

  document.querySelectorAll(".holderappresults").forEach((group) => {
    let hasVisibleItems = false;

    group.querySelectorAll(".menuitem").forEach((item) => {
      const code = (item.getAttribute("data-filter-code") || "").toLowerCase();
      const naam = (item.getAttribute("data-filter-naam") || "").toLowerCase();

      const matchesCode = !codeFilter || code.includes(codeFilter);
      const matchesNaam = !naamFilter || naam.includes(naamFilter);

      if (matchesCode && matchesNaam) {
        item.style.display = "block"; // Show item
        hasVisibleItems = true;
      } else {
        item.style.display = "none"; // Hide item
      }
    });

    const groupTop = group.previousElementSibling;
    if (groupTop && groupTop.classList.contains("holderapptop")) {
      groupTop.style.display = hasVisibleItems ? "flex" : "none";
    }

    group.style.display = hasVisibleItems ? "flex" : "none";
  });
}

document.getElementById("filter-code").addEventListener("input", applyFilters);
document.getElementById("filter-naam").addEventListener("input", applyFilters);



