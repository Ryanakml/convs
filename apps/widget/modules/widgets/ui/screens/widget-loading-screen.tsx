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
} from "../../atoms/widget-atoms";
import { WidgetHeader } from "../components/widget-header";
import { useAction, useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

type initStep = "org" | "session" | "setting" | "vapi" | "done";

export const WidgetLoadingScreen = ({
  organizationId,
}: {
  organizationId: string | null;
}) => {
  const [step, setStep] = useState<initStep>("org");
  const [sessionValid, setSessionValid] = useState(false);
  const setLoadingMessage = useSetAtom(loadingMessageAtom);
  const setOrganizationId = useSetAtom(organizationIdAtom);

  const contactSessionId = useAtomValue(
    contactSessionIdFamily(organizationId || "")
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
    api.public.contactSession.validate
  );

  useEffect(() => {
    if (step !== "session") {
      return;
    }

    setLoadingMessage("Finding contact session...");

    if (!contactSessionId) {
      setSessionValid(false);
      setStep("done");
      return;
    }

    setLoadingMessage("Validating contact session...");

    validateContactSession({
      contactSessionId: contactSessionId,
    })
      .then((result) => {
        setSessionValid(result.valid);
        setStep("done");
      })
      .catch(() => {
        setSessionValid(false);
        setStep("done");
      });
  }, [
    step,
    contactSessionId,
    setLoadingMessage,
    validateContactSession,
    setStep,
  ]);

  useEffect(() => {
    if (step !== "done") {
      return;
    }
    const hasValidSession = sessionValid;
    setScreen(hasValidSession ? "selection" : "auth");
  }, [step, sessionValid, setScreen]);

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
