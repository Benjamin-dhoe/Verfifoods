import { app } from '/js/firebase.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js';

const db = getFirestore(app);
const leverancierDropdown = document.getElementById("filter-leverancier");

// Populate Leverancier Dropdown
const leverancierCollection = collection(db, "Leveranciers");
getDocs(leverancierCollection).then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    const option = document.createElement("option");
    option.value = doc.data().Naam;
    option.textContent = doc.data().Naam;
    leverancierDropdown.appendChild(option);
  });
});

// Apply Filters
function applyFilters() {
  const codeFilter = document.getElementById("filter-code").value.toLowerCase();
  const leverancierFilter = leverancierDropdown.value.toLowerCase();
  const naamFilter = document.getElementById("filter-naam").value.toLowerCase();
  const isLeverancierSelected = leverancierDropdown.selectedIndex > 0;

  const isAnyFilterActive = codeFilter || leverancierFilter || naamFilter;

  document.querySelectorAll(".holderapptop").forEach((topElement) => {
    topElement.style.display = isAnyFilterActive ? "none" : "block";
  });

  document.querySelectorAll(".holderappresults").forEach((group) => {
    let hasVisibleItems = false;

    group.querySelectorAll(".menuitem").forEach((item) => {
      const code = (item.getAttribute("data-filter-code") || "").toLowerCase();
      const leverancier = (item.getAttribute("data-filter-leverancier") || "").toLowerCase();
      const naam = (item.getAttribute("data-filter-naam") || "").toLowerCase();

      const matchesCode = !codeFilter || code.includes(codeFilter);
      const matchesLeverancier = !isLeverancierSelected || leverancier === leverancierFilter;
      const matchesNaam = !naamFilter || naam.includes(naamFilter);

      if (matchesCode && matchesLeverancier && matchesNaam) {
        item.style.display = "block"; // Show item
        hasVisibleItems = true;
      } else {
        item.style.display = "none"; // Hide item
      }
    });

    group.style.display = hasVisibleItems ? "flex" : "none";
  });
}

document.getElementById("filter-code").addEventListener("input", applyFilters);
leverancierDropdown.addEventListener("change", applyFilters);
document.getElementById("filter-naam").addEventListener("input", applyFilters);


