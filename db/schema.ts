// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const requests = sqliteTable('requests', {
 id: text('id').primaryKey(), userId: text('user_id').notNull(), name: text('name').notNull(), contact: text('contact').notNull(), category: text('category').notNull(), origin: text('origin').notNull(), destination: text('destination').notNull(), date: text('date').notNull(), passengers: integer('passengers').notNull(), details: text('details').notNull(), status: text('status').notNull().default('Novo'), createdAt: text('created_at').notNull(), pickupTime: text('pickup_time').notNull().default(''), notes: text('notes').notNull().default('')
});
export const requestEvents = sqliteTable('request_events', { id:text('id').primaryKey(), requestId:text('request_id').notNull(), description:text('description').notNull(), createdAt:text('created_at').notNull() });
export const clientProfiles = sqliteTable('client_profiles',{userId:text('user_id').primaryKey(),name:text('name').notNull(),contact:text('contact').notNull()});
export const requestMessages = sqliteTable('request_messages',{id:text('id').primaryKey(),requestId:text('request_id').notNull(),sender:text('sender').notNull(),body:text('body').notNull(),createdAt:text('created_at').notNull()});
