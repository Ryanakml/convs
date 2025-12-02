import {
  CreateSecretCommand,
  GetSecretValueCommand,
  type GetSecretValueCommandOutput,
  PutSecretValueCommand,
  ResourceExistsException,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";

export function createSecretsManagerClient(): SecretsManagerClient {
  return new SecretsManagerClient({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  });
}

export async function getSecretValue(
  secretsName: string
): Promise<GetSecretValueCommandOutput> {
  const client = createSecretsManagerClient();
  return await client.send(
    new GetSecretValueCommand({
      SecretId: secretsName,
    })
  );
}

export async function upsertSecretValue(
  secretsName: string,
  secretValue: Record<string, unknown>
): Promise<void> {
  const client = createSecretsManagerClient();

  try {
    await client.send(
      new CreateSecretCommand({
        Name: secretsName,
        SecretString: JSON.stringify(secretValue),
      })
    );
  } catch (error) {
    if (error instanceof ResourceExistsException) {
      await client.send(
        new PutSecretValueCommand({
          SecretId: secretsName,
          SecretString: JSON.stringify(secretValue),
        })
      );
    } else {
      throw error;
    }
  }
}

export function parseSecretValue<T = Record<string, unknown>>(
  secretValue: GetSecretValueCommandOutput
): T | null {
  if (!secretValue.SecretString) {
    throw new Error("SecretString is empty");
  }

  try {
    return JSON.parse(secretValue.SecretString) as T;
  } catch (error) {
    return null;
  }
}
