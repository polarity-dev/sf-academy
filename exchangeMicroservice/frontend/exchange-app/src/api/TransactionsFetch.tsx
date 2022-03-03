import { useState } from "react";
import api from "./api";
import { Transaction } from "../utils/Interfaces";

const TransactionsFetch = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const fetchTransactions = async (
    id: number,
    token: string,
    setList: React.Dispatch<React.SetStateAction<Transaction[] | undefined>>
  ) => {
    try {
      setLoading(true);
      setError(false);
      const result = await api.transactions(id, token);
      setList(result.data.list);
    } catch (e) {
      console.log(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchTransactions,
    loading,
    error,
  };
};

export default TransactionsFetch;
