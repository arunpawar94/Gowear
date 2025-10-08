export const fullNameRegex = /^([A-Za-z][ '-]?)+([A-Za-z])*$/;
export const addressLineRegex = /^(?!.* {2})[-A-Za-z0-9.,'\/# ]{0,100}$/;
export const cityNameRegex = /^(?!.*[ '-]{2})[A-Za-z]+(?:[ '-][A-Za-z]*)*$/;
export const postalCodeRegex = /^(?!.*[ '-]{2})[A-Za-z0-9][A-Za-z0-9\s-]{0,9}$/;
export const mobileNoRegex = /^[6-9]\d{0,9}$/;
