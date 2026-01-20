import { createContext, useContext, useState, ReactNode } from "react";
import ContactFormDialog from "@/components/landing/ContactFormDialog";

interface ContactFormContextType {
  openContactForm: () => void;
}

const ContactFormContext = createContext<ContactFormContextType | undefined>(undefined);

export const useContactForm = () => {
  const context = useContext(ContactFormContext);
  if (!context) {
    throw new Error("useContactForm must be used within a ContactFormProvider");
  }
  return context;
};

interface ContactFormProviderProps {
  children: ReactNode;
}

export const ContactFormProvider = ({ children }: ContactFormProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const openContactForm = () => {
    setIsOpen(true);
  };

  return (
    <ContactFormContext.Provider value={{ openContactForm }}>
      {children}
      <ContactFormDialog open={isOpen} onOpenChange={setIsOpen} />
    </ContactFormContext.Provider>
  );
};
