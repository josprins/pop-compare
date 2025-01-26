"use client";

import { lusitana } from "@/app/ui/fonts";
import React, { useState, useRef } from "react";
import { fetchWorldBankData } from "@/app/lib/data";
import { formatNumber, formatCurrency } from "@/app/lib/utils";
import { MultiSelect } from "@/app/ui/components/MultiSelectDropdown";
import { Button } from "@/components/ui/button";
import {
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableSkeleton from "@/app/ui/skeletons";
import { Suspense } from "react";

const mockCountries = [
  { value: "USA", label: "United States", icon: "🇺🇸" },
  { value: "CAN", label: "Canada", icon: "🇨🇦" },
  { value: "MEX", label: "Mexico", icon: "🇲🇽" },
  { value: "BRA", label: "Brazil", icon: "🇧🇷" },
  { value: "ARG", label: "Argentina", icon: "🇦🇷" },
  { value: "COL", label: "Colombia", icon: "🇨🇴" },
  { value: "PER", label: "Peru", icon: "🇵🇪" },
  { value: "VEN", label: "Venezuela", icon: "🇻🇪" },
  { value: "CHL", label: "Chile", icon: "🇨🇱" },
  { value: "ECU", label: "Ecuador", icon: "🇪🇨" },
  { value: "BOL", label: "Bolivia", icon: "🇧🇴" },
  { value: "PRY", label: "Paraguay", icon: "🇵🇾" },
  { value: "URY", label: "Uruguay", icon: "🇺🇾" },
  { value: "GUY", label: "Guyana", icon: "🇬🇾" },
  { value: "SUR", label: "Suriname", icon: "🇸🇷" },
  { value: "BLZ", label: "Belize", icon: "🇧🇿" },
  { value: "GTM", label: "Guatemala", icon: "🇬🇹" },
  { value: "HND", label: "Honduras", icon: "🇭🇳" },
  { value: "SLV", label: "El Salvador", icon: "🇸🇻" },
  { value: "NIC", label: "Nicaragua", icon: "🇳🇮" },
  { value: "CRI", label: "Costa Rica", icon: "🇨🇷" },
  { value: "PAN", label: "Panama", icon: "🇵🇦" },
  { value: "CUB", label: "Cuba", icon: "🇨🇺" },
  { value: "HTI", label: "Haiti", icon: "🇭🇹" },
  { value: "DOM", label: "Dominican Republic", icon: "🇩🇴" },
  { value: "JAM", label: "Jamaica", icon: "🇯🇲" },
  { value: "TTO", label: "Trinidad and Tobago", icon: "🇹🇹" },
  { value: "BRB", label: "Barbados", icon: "🇧🇧" },
  { value: "BHS", label: "Bahamas", icon: "🇧🇸" },
  { value: "GRD", label: "Grenada", icon: "🇬🇩" },
  { value: "LCA", label: "Saint Lucia", icon: "🇱🇨" },
  { value: "VCT", label: "Saint Vincent and the Grenadines", icon: "🇻🇨" },
  { value: "ATG", label: "Antigua and Barbuda", icon: "🇦🇬" },
  { value: "DMA", label: "Dominica", icon: "🇩🇲" },
  { value: "KNA", label: "Saint Kitts and Nevis", icon: "🇰🇳" },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1975 - 1 }, (_, i) => {
  return {
    value: (1975 + i).toString(),
    label: (1975 + i).toString(),
  };
}).reverse();

const indicators = [
  { value: "SP.POP.TOTL", label: "Population" },
  { value: "NY.GDP.MKTP.CD", label: "GDP" },
  { value: "NY.GDP.PCAP.CD", label: "GDP per Capita" },
  { value: "SP.DYN.LE00.IN", label: "Life Expectancy" },
  { value: "SL.UEM.TOTL.ZS", label: "Unemployment" },
];

export default function ComparisonExplorer() {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  const [countryData, setCountryData] = useState<{
    [country: string]: {
      [indicator: string]: { date: string; value: number }[];
    };
  }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selecting, setSelecting] = useState(true);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await fetchWorldBankData(
        selectedCountries,
        selectedYears,
        selectedIndicators
      );

      setCountryData(data);
      setSelecting(false);
    } catch (error) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCountries = (value: string[]) => {
    setSelecting(true);
    setSelectedCountries(value);
  };

  const handleSelectYears = (value: string[]) => {
    setSelecting(true);
    setSelectedYears(value);
  };

  const handleSelectIndicators = (value: string[]) => {
    setSelecting(true);
    setSelectedIndicators(value);
  };

  const scrollLeft = () => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className={`${lusitana.className}`}>
      <div className="p-4 mb-6 text-lg bg-blue-50 border-l-4 border-blue-100 shadow-md">
        <p>
          To get started, select one or more countries, years, and indicators
          you would like data from using the dropdown menus below. Once you have
          made your selections, click the "Get data" button to retrieve the
          data.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-[70%] mt-10">
        <div className="flex flex-col space-y-4">
          <div className="flex">
            <label
              htmlFor="countries"
              className="mb-2 min-w-[140px] text-right mr-5 font-bold"
            >
              Select countries:*
            </label>
            <MultiSelect
              id="countries"
              options={mockCountries}
              onValueChange={handleSelectCountries}
              defaultValue={selectedCountries}
              placeholder="Select countries"
              variant="default"
              animation={2}
              maxCount={3}
              className="bg-white p-2 rounded-lg shadow-md"
            />
          </div>
          <div className="flex">
            <label
              htmlFor="years"
              className="mb-2 min-w-[140px] text-right mr-5 font-bold"
            >
              Select years:*
            </label>
            <MultiSelect
              id="years"
              options={years}
              onValueChange={handleSelectYears}
              defaultValue={selectedYears}
              placeholder="Select years"
              variant="default"
              animation={2}
              maxCount={3}
              className="bg-white p-2 rounded-lg shadow-md"
            />
          </div>
          <div className="flex">
            <label
              htmlFor="indicators"
              className="mb-2 min-w-[140px] text-right mr-5 font-bold"
            >
              Select indicators:*
            </label>
            <MultiSelect
              id="indicators"
              options={indicators}
              onValueChange={handleSelectIndicators}
              defaultValue={selectedIndicators}
              placeholder="Select indicators"
              variant="default"
              animation={2}
              maxCount={3}
              className="bg-white p-2 rounded-lg shadow-md"
            />
          </div>
        </div>
        <div className="flex">
          <div className="min-w-[140px] mr-5">&nbsp;</div>
          <Button variant="submit" className="font-bold">
            Get data
          </Button>
        </div>
      </form>
      <div className="flex mt-4">
        <div className="min-w-[140px] mr-5">&nbsp;</div>
        <p className="text-sm text-gray-500 italic">
          Fields marked with * are required
        </p>
      </div>
      {loading ? (
        <TableSkeleton
          columnCount={selectedYears.length * selectedIndicators.length + 1}
        />
      ) : (
        <Suspense
          fallback={
            <TableSkeleton
              columnCount={selectedYears.length * selectedIndicators.length + 1}
            />
          }
        >
          {Object.keys(countryData).length > 0 && selecting === false && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-4 text-gray-500">
                Data per Country per Year
              </h2>
              <div className="relative flex">
                <button
                  className="bg-gray-200 text-white font-bold w-10 hover:bg-gray-300"
                  onClick={scrollLeft}
                >
                  &lt;
                </button>
                <div
                  className="overflow-x-auto max-h-[100vh] border border-gray-300"
                  ref={tableContainerRef}
                >
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-400 text-white">
                        <th className="sticky top-[-1px] z-10 p-4 text-left border bg-gray-400">
                          Country
                        </th>
                        {selectedYears.flatMap((year) =>
                          selectedIndicators.map((indicator) => (
                            <th
                              key={`${year}-${indicator}`}
                              className="sticky top-[-1px] z-10 p-4 text-right border bg-gray-400"
                            >
                              <div>{year}</div>
                              {
                                indicators.find(
                                  (ind) => ind.value === indicator
                                )?.label
                              }
                            </th>
                          ))
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(countryData).map((country, index) => (
                        <tr
                          key={country}
                          className={
                            index % 2 === 0 ? "bg-gray-100" : "bg-white"
                          }
                        >
                          <td className="text-left p-4 border">{country}</td>
                          {selectedYears.flatMap((year) =>
                            selectedIndicators.map((indicator) => (
                              <td
                                key={`${indicator}-${year}`}
                                className="text-right p-4 border"
                              >
                                {indicator.startsWith("NY.")
                                  ? formatCurrency(
                                      countryData[country][indicator]?.find(
                                        (data) => data.date === year
                                      )?.value || 0
                                    )
                                  : formatNumber(
                                      countryData[country][indicator]?.find(
                                        (data) => data.date === year
                                      )?.value || 0
                                    )}
                              </td>
                            ))
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  onClick={scrollRight}
                  className="bg-gray-200 text-white font-bold w-10 hover:bg-gray-300"
                >
                  &gt;
                </button>
              </div>
            </div>
          )}
        </Suspense>
      )}
    </div>
  );
}

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <table
    ref={ref}
    className={`w-full caption-bottom text-sm ${className}`}
    {...props}
  />
));
Table.displayName = "Table";
