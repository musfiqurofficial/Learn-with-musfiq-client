import { useState } from "react";

export const useNotFound = () => {
  const [isNotFound, setIsNotFound] = useState(false);

  return { isNotFound, setIsNotFound };
};