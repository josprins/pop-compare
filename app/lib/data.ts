"use server";

import { sql } from "@vercel/postgres";
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from "./definitions";
import { formatCurrency } from "./utils";
import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

export async function fetchCountries() {
  try {
    const countries = await prisma.country.findMany();
    return countries
      .filter((country) => country.name.split(" ").length < 3)
      .map((country) => ({
        value: country.iso_code,
        label: country.name,
        icon: country.iso_code.replace(/./g, (char) => {
          return String.fromCodePoint(127397 + char.charCodeAt(0));
        }),
      }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch countries.");
  }
}

export async function fetchComparisons() {
  try {
    const comparisons = await prisma.comparison.findMany({
      include: {
        comparisonData: {
          include: {
            populationData: {
              include: {
                country: true,
              },
            },
          },
        },
      },
    });
    return comparisons;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch comparisons.");
  }
}

export async function fetchComparisonData() {
  try {
    const comparisonData = await prisma.comparisonData.findMany({
      include: {
        comparison: true,
        populationData: {
          include: {
            country: true,
          },
        },
      },
    });
    return comparisonData;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch comparison data.");
  }
}

export async function fetchCountryById(id: number) {
  try {
    const country = await prisma.country.findUnique({
      where: { id },
    });
    return country;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch country.");
  }
}

export async function fetchPopulationDataByCountryId(countryId: number) {
  try {
    const populationData = await prisma.populationData.findMany({
      where: { country_id: countryId },
    });
    return populationData;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch population data.");
  }
}

export async function fetchComparisonById(id: number) {
  try {
    const comparison = await prisma.comparison.findUnique({
      where: { id },
      include: {
        comparisonData: {
          include: {
            populationData: {
              include: {
                country: true,
              },
            },
          },
        },
      },
    });
    return comparison;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch comparison.");
  }
}

type PopulationData = {
  [country: string]: {
    [indicator: string]: {
      date: string;
      value: number;
    }[];
  };
};

export async function fetchWorldBankData(
  countryCodes: string[],
  years: (string | number)[],
  indicators: string[]
): Promise<PopulationData> {
  try {
    let data: PopulationData = {};

    // Generate all requests for the API
    const requests = countryCodes.flatMap((countryCode) =>
      indicators.flatMap((indicator) =>
        years.map((year) =>
          axios.get(
            `http://api.worldbank.org/v2/country/${countryCode}/indicator/${indicator}?date=${year}&format=json`
          )
        )
      )
    );

    const responses = await Promise.all(requests);

    // Process responses
    for (const response of responses) {
      const result = response.data[1];
      if (result && result.length > 0) {
        const { country, date, value, indicator } = result[0];

        if (!data[country.value]) {
          data[country.value] = {};
        }

        if (!data[country.value][indicator.id]) {
          data[country.value][indicator.id] = [];
        }

        data[country.value][indicator.id].push({
          date,
          value,
        });
      }
    }

    return data;
  } catch (error) {
    console.error("Error fetching World Bank data:", error);
    throw new Error("Failed to fetch data from World Bank.");
  }
}
