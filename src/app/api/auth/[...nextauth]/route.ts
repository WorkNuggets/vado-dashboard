import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await fakeLoginCheck(credentials);
        if (user) {
          return user; // Must be an object with an 'id' or similar
        }
        return null;
      },
    }),
  ],
  // ...Other NextAuth config
  secret: process.env.NEXTAUTH_SECRET,
});

async function fakeLoginCheck(credentials?: Record<string, string>) {
  // Example: Hard-coded user
  if (credentials?.username === "spence" && credentials?.password === "secret") {
    return { id: "123", name: "Spence", email: "spence@example.com" };
  }
  return null;
}

export { handler as GET, handler as POST };
