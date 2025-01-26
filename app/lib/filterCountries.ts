const fs = require("fs");
const path = require("path");

// Load JSON data
const countriesFilePath = path.join(__dirname, "../countries.json");
const countries = JSON.parse(fs.readFileSync(countriesFilePath, "utf-8"));

// List of known non-country identifiers
const nonCountryIds = [
  "AFE",
  "AFR",
  "AFW",
  "ARB",
  "CEB",
  "CSS",
  "EAS",
  "ECS",
  "EMU",
  "EUU",
  "FCS",
  "HIC",
  "HPC",
  "IBB",
  "IBD",
  "IBT",
  "IDA",
  "IDB",
  "IDX",
  "INX",
  "LIC",
  "LMC",
  "LMY",
  "MEA",
  "MIC",
  "NAC",
  "OED",
  "OSS",
  "PSS",
  "PST",
  "PRE",
  "SAS",
  "SSA",
  "SSF",
  "SST",
  "UMC",
  "WLD",
];

// Filter out non-country items
const realCountries = countries.filter(
  (country: any) => !nonCountryIds.includes(country.id)
);

// Write filtered data to a new JSON file
const filteredCountriesFilePath = path.join(
  __dirname,
  "../filteredCountries.json"
);
fs.writeFileSync(
  filteredCountriesFilePath,
  JSON.stringify(realCountries, null, 2)
);

console.log("Filtered countries have been saved to filteredCountries.json");
