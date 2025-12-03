import { useAction } from "convex/react";
import { useState, useEffect } from "react";
import { api } from "@workspace/backend/_generated/api";
import { toast } from "sonner";

type phoneNumbers =
  typeof api.private.vapi.getPhoneNumberVapiClient._returnType;

type assistants = typeof api.private.vapi.getAssistants._returnType;

interface UseVapiPhoneNumberResult {
  data: phoneNumbers | null;
  isLoading: boolean;
  error: Error | null;
}

interface UseVapiAssistantsResult {
  data: assistants | null;
  isLoading: boolean;
  error: Error | null;
}

export const useVapiAssistant = (): UseVapiAssistantsResult => {
  const [data, setData] = useState<assistants | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const getAssistants = useAction(api.private.vapi.getAssistants);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await getAssistants();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err as Error);
        toast.error("Failed to fetch Vapi assistants.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [getAssistants]);

  return { data, isLoading, error };
};

export const useVapiPhoneNumber = (): UseVapiPhoneNumberResult => {
  const [data, setData] = useState<phoneNumbers | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const getPhoneNumbers = useAction(api.private.vapi.getPhoneNumberVapiClient);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await getPhoneNumbers();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err as Error);
        toast.error("Failed to fetch Vapi phone numbers.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [getPhoneNumbers]);

  return { data, isLoading, error };
};
