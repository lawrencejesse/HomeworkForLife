import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { entries, insertEntrySchema } from "@db/schema";
import { db } from "@db";
import { eq, desc, and } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Get all entries for the logged in user
  app.get("/api/entries", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not logged in");
    }

    const userEntries = await db
      .select()
      .from(entries)
      .where(eq(entries.userId, req.user.id))
      .orderBy(desc(entries.createdAt));

    res.json(userEntries);
  });

  // Create a new entry
  app.post("/api/entries", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not logged in");
    }

    const result = insertEntrySchema.safeParse({
      ...req.body,
      userId: req.user.id
    });

    if (!result.success) {
      return res.status(400).send(result.error.issues.map(i => i.message).join(", "));
    }

    const [entry] = await db
      .insert(entries)
      .values(result.data)
      .returning();

    res.json(entry);
  });

  // Get entries for a specific date
  app.get("/api/entries/:date", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not logged in");
    }

    const date = new Date(req.params.date);
    if (isNaN(date.getTime())) {
      return res.status(400).send("Invalid date");
    }

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const userEntries = await db
      .select()
      .from(entries)
      .where(
        and(
          eq(entries.userId, req.user.id),
          entries.createdAt >= date,
          entries.createdAt < nextDate
        )
      )
      .orderBy(desc(entries.createdAt));

    res.json(userEntries);
  });

  const httpServer = createServer(app);
  return httpServer;
}
