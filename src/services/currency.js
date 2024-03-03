import axiosClient from "src/axios";

export const getCurrencyRate = async (from, to, amount) => {
  return await axiosClient.get(
    "https://currency-exchange.p.rapidapi.com/exchange",
    {
      params: {
        from: from,
        to: to,
      },
      headers: {
        "X-RapidAPI-Key": "6d6c57b35cmsh4b5e45f2fc7b509p1f1ea9jsnd69ea7da20c0",
        "X-RapidAPI-Host": "currency-exchange.p.rapidapi.com",
      },
    }
  );
};
