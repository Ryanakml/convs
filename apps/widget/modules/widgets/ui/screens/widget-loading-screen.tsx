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
} from "../../atoms/widget-atoms";
import { WidgetHeader } from "../components/widget-header";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

type initStep = "org" | "session" | "setting" | "vapi" | "done";

export const WidgetLoadingScreen = ({
  organizationId,
}: {
  organizationId: string | null;
}) => {
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState<initStep>("org");
  const [sessionValid, setSessionValid] = useState(false);
  const setLoadingMessage = useSetAtom(loadingMessageAtom);
  const setOrganizationId = useSetAtom(organizationIdAtom);
  const setVapiSecrets = useSetAtom(vapiSecretsAtom);
  const setWidgetSettings = useSetAtom(widgetSettingsAtom);

  const contactSessionId = useAtomValue(
    contactSessionIdFamily(organizationId || ""),
  );

  const loadingMessage = useAtomValue(loadingMessageAtom);
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const setScreen = useSetAtom(screenAtom);

  const validateOrganization = useAction(api.public.organizations.validate);
  useEffect(() => {
    if (step !== "org") {
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
    setStep,
    setLoadingMessage,
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
        .then((newSessionId) => {
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
      setWidgetSettings(widgetSettings);
      setStep("vapi");
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
        setVapiSecrets(secrets);
        setStep("done");
      })
      .catch(() => {
        setVapiSecrets(null);
        setStep("done");
      });
  }, [step, organizationId, setLoadingMessage, getVapiSecrets, setStep]);

  useEffect(() => {
    if (step !== "done") {
      return;
    }
    // Skip auth screen if session is valid (anonymous or user-provided)
    setScreen(sessionValid ? "selection" : "auth");
  }, [step, sessionValid, setScreen]);

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
