// define the onSubmit function
function onSubmit(event) {
  event.preventDefault();

  var formData = new FormData(event.target);
  var jsonData = Object.fromEntries(formData.entries());

  //   alert(JSON.stringify(jsonData));

  // https://gist.github.com/ghalimi/4638848
  //   function PV(rate, nper, pmt) {
  //     return (pmt / rate) * (1 - Math.pow(1 + rate, -nper));
  //   }

  //   const b = PV(
  //     Number(jsonData["current-rate"]) / 1200,
  //     Number(jsonData["current-tenure"]),
  //     Number(jsonData["current-emi"])
  //   );

  const pendingPrinciple = formulajs.PV(
    Number(jsonData["current-rate"]) / (12 * 100),
    Number(jsonData["current-tenure"]),
    -Number(jsonData["current-emi"])
  );

  const effectiveLoan = pendingPrinciple - Number(jsonData["od-loan"]);

  const lowestMktRate = 7.9;

  const newTenure = formulajs.NPER(
    lowestMktRate / (12 * 100),
    -Number(jsonData["current-emi"]),
    effectiveLoan
  );

  const totalSaving =
    (Number(jsonData["current-tenure"]) - newTenure) *
    Number(jsonData["current-emi"]);

  document.querySelector("#pending-principle").textContent = pendingPrinciple;
  //   document
  //     .querySelector("#pending-principle")
  //     .insertAdjacentText("beforeend", ` ${pendingPrinciple}`);
  document.querySelector("#effective-loan").textContent = effectiveLoan;
  document.querySelector("#new-tenure").textContent = newTenure;
  document.querySelector("#total-saving").textContent = totalSaving;
}

// attach the onSubmit function to the form
document.addEventListener("DOMContentLoaded", function () {
  document.querySelector(".contact-form").addEventListener("submit", onSubmit);
});
