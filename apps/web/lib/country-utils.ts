import * as ct from "countries-and-timezones";

export function getCountryFromTimezone(timezone: string) {
  if (!timezone) return null;

  const timezoneInfo = ct.getTimezone(timezone);
  const countryCode = timezoneInfo?.countries?.[0];

  if (!countryCode) return null;

  const country = ct.getCountry(countryCode);

  return {
    code: countryCode,
    name: country?.name ?? null,
  };
}

export function getCountryFlagUrl(countryCode: string) {
  return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
}
