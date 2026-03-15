import { getPayload } from "payload";

type ParsedArgs = {
  email?: string;
  password?: string;
  unlock: boolean;
  help: boolean;
};

const usage = `
Usage:
  pnpm --filter app reset:password -- --email you@example.com --password 'NewStrongPass123!'
  pnpm --filter app reset:password -- --email you@example.com --password 'NewStrongPass123!' --unlock

Flags:
  --email <value>       User email to reset
  --password <value>    New password to set
  --unlock              Also clear login lockout fields
  --help                Show this message
`.trim();

const parseArgs = (argv: string[]): ParsedArgs => {
  const parsed: ParsedArgs = {
    unlock: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--unlock") {
      parsed.unlock = true;
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
      continue;
    }

    if (arg === "--email") {
      parsed.email = argv[i + 1];
      i += 1;
      continue;
    }

    if (arg.startsWith("--email=")) {
      parsed.email = arg.slice("--email=".length);
      continue;
    }

    if (arg === "--password") {
      parsed.password = argv[i + 1];
      i += 1;
      continue;
    }

    if (arg.startsWith("--password=")) {
      parsed.password = arg.slice("--password=".length);
    }
  }

  return parsed;
};

const main = async () => {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    console.log(usage);
    return;
  }

  if (!args.email || !args.password) {
    console.error("Missing required flags. Both --email and --password are required.");
    console.error(usage);
    process.exitCode = 1;
    return;
  }

  const { default: config } = await import("../src/payload.config");
  const payload = await getPayload({ config });

  const users = await payload.find({
    collection: "users",
    where: { email: { equals: args.email } },
    limit: 1,
    overrideAccess: true,
  });

  if (!users.docs.length) {
    throw new Error(`User not found for email: ${args.email}`);
  }

  const user = users.docs[0];
  const updateData: {
    password: string;
    loginAttempts?: number;
    lockUntil?: null;
  } = {
    password: args.password,
  };

  if (args.unlock) {
    updateData.loginAttempts = 0;
    updateData.lockUntil = null;
  }

  await payload.update({
    collection: "users",
    id: user.id,
    data: updateData,
    overrideAccess: true,
  });

  console.log(`Password reset complete for ${args.email}`);
  if (args.unlock) {
    console.log("Lockout fields were also cleared (loginAttempts=0, lockUntil=null).");
  }
};

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Password reset failed: ${message}`);
  process.exitCode = 1;
});
