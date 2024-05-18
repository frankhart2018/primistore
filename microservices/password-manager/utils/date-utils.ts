const getCurrentTime = (): string => {
  const currentDate = new Date();
  const systemTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: systemTimeZone,
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
    currentDate,
  );

  return formattedDate;
};

export { getCurrentTime };
