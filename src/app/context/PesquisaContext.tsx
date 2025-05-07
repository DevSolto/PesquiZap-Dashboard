'use client'
import React, { createContext, useContext, useState } from 'react';

type PesquisaContextType = {
  selectedPesquisa: string | null;
  setSelectedPesquisa: (id: string) => void;
};

const PesquisaContext = createContext<PesquisaContextType | undefined>(undefined);

export const PesquisaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedPesquisa, setSelectedPesquisa] = useState<string | null>(null);

  return (
    <PesquisaContext.Provider value={{ selectedPesquisa, setSelectedPesquisa }}>
      {children}
    </PesquisaContext.Provider>
  );
};

export const usePesquisa = (): PesquisaContextType => {
  const context = useContext(PesquisaContext);
  if (!context) {
    throw new Error("usePesquisa must be used within a PesquisaProvider");
  }
  return context;
};
