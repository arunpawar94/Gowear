import { State } from "country-state-city";

export default function (nameOrIsoCode: string, countryCode: string) {
  const states = State.getStatesOfCountry(countryCode);
  const stateDetail = states.find(
    (item) => item.name === nameOrIsoCode || item.isoCode === nameOrIsoCode
  );
  return stateDetail;
}
