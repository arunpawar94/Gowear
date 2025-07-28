const getCookie = (name: string): string | null => {
    console.log("@@@3", name)
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
};

export { getCookie };
