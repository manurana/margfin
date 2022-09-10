const LOWEST_MKT_RATE = 0.079;

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

  const newTenure = formulajs.NPER(
    LOWEST_MKT_RATE / 12,
    -Number(jsonData["current-emi"]),
    effectiveLoan
  );

  const totalSaving =
    (Number(jsonData["current-tenure"]) - newTenure) *
    Number(jsonData["current-emi"]);

  const rupeeFormat = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

  const rateFormat = new Intl.NumberFormat("en-IN", {
    style: "percent",
    minimumFractionDigits: 2,
  });

  document.querySelector("#lowest-rate").textContent =
    rateFormat.format(LOWEST_MKT_RATE);
  document.querySelector("#pending-principle").textContent =
    rupeeFormat.format(pendingPrinciple);
  document.querySelector("#effective-loan").textContent =
    rupeeFormat.format(effectiveLoan);
  document.querySelector("#new-tenure").textContent = Math.round(newTenure);
  document.querySelector("#total-saving").textContent =
    rupeeFormat.format(totalSaving);
}

// attach the onSubmit function to the form
document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("#contact-form").addEventListener("submit", onSubmit);
});
