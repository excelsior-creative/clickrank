"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import ContactDialog from "./ContactDialog";
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

type ContactDialogContextType = {
  openContactDialog: () => void;
  closeContactDialog: () => void;
  isOpen: boolean;
};

const ContactDialogContext = createContext<ContactDialogContextType | undefined>(
  undefined
);

export function useContactDialog() {
  const context = useContext(ContactDialogContext);
  if (!context) {
    throw new Error(
      "useContactDialog must be used within a ContactDialogProvider"
    );
  }
  return context;
}

type ContactDialogProviderProps = {
  children: React.ReactNode;
};

export function ContactDialogProvider({ children }: ContactDialogProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const openContactDialog = useCallback(() => {
    setIsOpen(true);
    setHasOpened(true);
  }, []);

  const closeContactDialog = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ContactDialogContext.Provider
      value={{ openContactDialog, closeContactDialog, isOpen }}
    >
      {children}
      {hasOpened && (
        recaptchaSiteKey ? (
          <GoogleReCaptchaProvider
            reCaptchaKey={recaptchaSiteKey}
            scriptProps={{
              async: true,
              defer: true,
              appendTo: 'head',
            }}
          >
            <ContactDialog isOpen={isOpen} onClose={closeContactDialog} />
          </GoogleReCaptchaProvider>
        ) : (
          <ContactDialog isOpen={isOpen} onClose={closeContactDialog} />
        )
      )}
    </ContactDialogContext.Provider>
  );
}

export default ContactDialogProvider;

