import { Country } from "country-state-city";

export default function (nameOrIsoCode: string) {
  const countries = Country.getAllCountries();
  const countryDetail = countries.find(
    (item) => item.name === nameOrIsoCode || item.isoCode === nameOrIsoCode
  );
  return countryDetail;
}
