"use client";

import { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { LoaderCircleIcon } from "lucide-react";
import {
  contactSessionIdFamily,
  errorMessageAtom,
  loadingMessageAtom,
  organizationIdAtom,
  screenAtom,
  vapiSecretsAtom,
  widgetSettingsAtom,
  conversationIdAtom,
  showGreetingAtom,
} from "../../atoms/widget-atoms";
import { WidgetHeader } from "../components/widget-header";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

type initStep = "org" | "session" | "setting" | "vapi" | "done";

// Helper: Check if prefetch is available and valid
function isPrefetchValid(organizationId: string): boolean {
  try {
    const prefetchKey = `convs_prefetch_${organizationId}`;
    const stored = localStorage.getItem(prefetchKey);
    if (!stored) return false;

    const data = JSON.parse(stored);
    const age = Date.now() - data.timestamp;
    const MAX_AGE = 30 * 60 * 1000; // 30 minutes

    return age < MAX_AGE && data.sessionId && data.orgId === organizationId;
  } catch {
    return false;
  }
}

export const WidgetLoadingScreen = ({
  organizationId,
}: {
  organizationId: string | null;
}) => {
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState<initStep>("org");
  const [isPrefetched, setIsPrefetched] = useState(false);
  const [sessionValid, setSessionValid] = useState(false);
  const setLoadingMessage = useSetAtom(loadingMessageAtom);
  const setOrganizationId = useSetAtom(organizationIdAtom);
  const setVapiSecrets = useSetAtom(vapiSecretsAtom);
  const setWidgetSettings = useSetAtom(widgetSettingsAtom);
  const setShowGreeting = useSetAtom(showGreetingAtom);

  const contactSessionId = useAtomValue(
    contactSessionIdFamily(organizationId || ""),
  );

  const loadingMessage = useAtomValue(loadingMessageAtom);
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const setScreen = useSetAtom(screenAtom);

  const validateOrganization = useAction(api.public.organizations.validate);

  useEffect(() => {
    setHydrated(true);

    // Check if prefetch is available
    if (organizationId && isPrefetchValid(organizationId)) {
      console.log("[Widget] Prefetch detected, skipping org validation");
      setIsPrefetched(true);
      setOrganizationId(organizationId);
      setSessionValid(true);
      // Skip directly to setting (org + session already done)
      setStep("setting");
    }
  }, []);

  useEffect(() => {
    if (step !== "org") {
      return;
    }

    // Skip org validation if prefetched
    if (isPrefetched) {
      console.log("[Widget] Skipping org validation, already prefetched");
      setStep("session");
      return;
    }

    setLoadingMessage("Loading organization...");

    if (!organizationId) {
      setErrorMessage("Organization ID is missing.");
      setScreen("error");
      return;
    }

    setLoadingMessage("Validating organization...");
    validateOrganization({ organizationId: organizationId! })
      .then((result) => {
        if (result.valid) {
          setOrganizationId(organizationId);
          setStep("session");
        } else {
          setErrorMessage(result.reason || "Organization validation failed.");
          setScreen("error");
        }
      })
      .catch(() => {
        setErrorMessage("Unable to validate organization.");
        setScreen("error");
      });
  }, [
    step,
    organizationId,
    setScreen,
    setOrganizationId,
    setLoadingMessage,
    validateOrganization,
    isPrefetched,
    setStep,
    setErrorMessage,
  ]);

  const validateContactSession = useMutation(
    api.public.contactSession.validate,
  );
  const createAnonymousSession = useMutation(
    api.public.contactSession.createAnonymous,
  );

  // Helper to collect metadata
  const getMetadata = () => ({
    userAgent: navigator.userAgent,
    language: navigator.language,
    languages: navigator.languages.join(", "),
    platform: navigator.platform,
    vendor: navigator.vendor,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    viewportSize: `${window.innerWidth}x${window.innerHeight}`,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timeZoneOffset: new Date().getTimezoneOffset(),
    cookieEnabled: navigator.cookieEnabled,
    referrer: document.referrer || "direct",
    currentUrl: window.location.href,
  });

  useEffect(() => {
    if (step !== "session") {
      return;
    }

    // Skip session validation if prefetched (session already created & stored in localStorage)
    if (isPrefetched) {
      console.log("[Widget] Skipping session validation, already prefetched");
      setStep("setting");
      return;
    }

    setLoadingMessage("Finding contact session...");

    if (contactSessionId) {
      // Session exists, validate it
      setLoadingMessage("Validating contact session...");
      validateContactSession({
        contactSessionId: contactSessionId,
      })
        .then((result) => {
          setSessionValid(result.valid);
          setStep("setting");
        })
        .catch(() => {
          setSessionValid(false);
          setStep("setting");
        });
    } else {
      // No session exists, create anonymous one automatically
      if (!organizationId) {
        setSessionValid(false);
        setStep("setting");
        return;
      }

      setLoadingMessage("Creating anonymous session...");
      createAnonymousSession({
        organizationId,
        metadata: getMetadata(),
      })
        .then(() => {
          // The atom will be updated automatically since it uses localStorage
          setSessionValid(true);
          setStep("setting");
        })
        .catch(() => {
          setSessionValid(false);
          setStep("setting");
        });
    }
  }, [
    step,
    contactSessionId,
    organizationId,
    setLoadingMessage,
    validateContactSession,
    createAnonymousSession,
    isPrefetched,
    setStep,
  ]);

  // to do
  const widgetSettings = useQuery(
    api.public.widgetSettings.getByOrganizationId,
    organizationId
      ? {
          organizationId: organizationId,
        }
      : "skip",
  );

  useEffect(() => {
    if (step !== "setting") {
      return;
    }

    setLoadingMessage("Loading widget settings...");

    if (widgetSettings !== undefined) {
      console.log("Widget settings loaded:", widgetSettings);
      setWidgetSettings(widgetSettings);
      setStep("vapi");
    } else {
      console.log("Widget settings still loading or not found");
    }
  }, [step, widgetSettings, setWidgetSettings, setStep, setLoadingMessage]);

  const getVapiSecrets = useAction(api.public.secrets.getVapiSecrets);
  useEffect(() => {
    if (step !== "vapi") {
      return;
    }

    if (!organizationId) {
      setErrorMessage("Organization ID is missing.");
      setScreen("error");
      return;
    }
    setLoadingMessage("Loading VAPI Features...");
    getVapiSecrets({ organizationId })
      .then((secrets) => {
        console.log("Vapi secrets loaded:", secrets);
        setVapiSecrets(secrets);
        setStep("done");
      })
      .catch((error) => {
        console.error("Failed to load Vapi secrets:", error);
        setVapiSecrets(null);
        setStep("done");
      });
  }, [
    step,
    organizationId,
    setLoadingMessage,
    getVapiSecrets,
    setStep,
    setErrorMessage,
    setScreen,
    setVapiSecrets,
  ]);

  const setConversationId = useSetAtom(conversationIdAtom);
  const createConversation = useMutation(api.public.conversations.create);

  useEffect(() => {
    if (step !== "done") {
      return;
    }

    if (!sessionValid) {
      // If session is not valid, go to auth
      setScreen("auth");
      return;
    }

    // Auto-create conversation and go to chat
    if (!organizationId || !contactSessionId) {
      setScreen("error");
      setErrorMessage("Missing required data");
      return;
    }

    setLoadingMessage("Starting conversation...");

    createConversation({
      organizationId,
      contactSessionId,
    })
      .then((conversationId) => {
        // Save prefetch data for future loads
        try {
          const prefetchKey = `convs_prefetch_${organizationId}`;
          localStorage.setItem(
            prefetchKey,
            JSON.stringify({
              orgId: organizationId,
              sessionId: contactSessionId,
              timestamp: Date.now(),
            }),
          );
        } catch (error) {
          console.warn("[Widget] Failed to save prefetch data:", error);
        }

        setConversationId(conversationId);
        // Go directly to chat (greeting will be shown from embed button as popup)
        setScreen("chat");
      })
      .catch(() => {
        setScreen("error");
        setErrorMessage("Failed to create conversation");
      });
  }, [
    step,
    sessionValid,
    setScreen,
    organizationId,
    contactSessionId,
    createConversation,
    setConversationId,
    setErrorMessage,
    setLoadingMessage,
    setShowGreeting,
  ]);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col gap-y-2">
          <p className="text-3xl font-semibold">Hi there!</p>
          <p className="text-lg text-muted-foreground">Lets get you started</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4">
        <LoaderCircleIcon className="animate-spin" />
        <p className="text-sm">
          {loadingMessage || "Loading... Please wait a moment."}
        </p>
      </div>
    </>
  );
};
