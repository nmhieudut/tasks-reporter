import axiosClient from "src/axios";

export const getCurrencyRate = async () => {
  return await axiosClient.get(
    "https://api.exchangerate-api.com/v4/latest/USD"
  );
};
