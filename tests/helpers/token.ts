import jwt from "jsonwebtoken";
export function tokenFor(
  id: string,
  role: "member" | "librarian" = "member",
): string {
  return jwt.sign({ role }, process.env.JWT_SECRET!, {
    subject: id as string,
    expiresIn: "1h",
  });
}
