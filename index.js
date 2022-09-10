const LOWEST_MKT_RATE = 0.079;

// define the onSubmit function
function onSubmit(event) {
  event.preventDefault();

  var formData = new FormData(event.target);
  var jsonData = Object.fromEntries(formData.entries());

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

  const monthFormat = new Intl.NumberFormat("en-IN", {
    style: "unit",
    unit: "month",
    unitDisplay: "long",
    maximumFractionDigits: 0,
  });

  document.querySelector("#lowest-rate").textContent =
    rateFormat.format(LOWEST_MKT_RATE);
  document.querySelector("#pending-principle").textContent =
    rupeeFormat.format(pendingPrinciple);
  document.querySelector("#effective-loan").textContent =
    rupeeFormat.format(effectiveLoan);
  document.querySelector("#new-tenure").textContent =
    monthFormat.format(newTenure);
  document.querySelector("#total-saving").textContent =
    rupeeFormat.format(totalSaving);

  document
    .querySelector("#proposed-loan")
    .style.setProperty("display", "block");
  //   window.scrollTo(0, document.body.scrollHeight);
}

// attach the onSubmit function to the form
document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("#contact-form").addEventListener("submit", onSubmit);
});
