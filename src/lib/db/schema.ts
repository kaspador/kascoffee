import 'server-only';

import { relations } from 'drizzle-orm';
import {
	boolean,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
	bigint
} from 'drizzle-orm/pg-core';

// Enums
export const socialPlatformEnum = pgEnum('social_platform', [
	'twitter',
	'discord',
	'telegram',
	'website'
]);

// Users table (Better Auth will handle this, but we extend it)
export const users = pgTable('user', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	emailVerified: timestamp('emailVerified'),
	image: text('image'),
	createdAt: timestamp('createdAt').defaultNow().notNull(),
	updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

// User pages table (separate from auth users)
export const userPages = pgTable('user_page', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id')
		.references(() => users.id, { onDelete: 'cascade' })
		.notNull(),
	handle: varchar('handle', { length: 50 }).notNull().unique(),
	displayName: text('display_name').notNull(),
	shortDescription: varchar('short_description', { length: 300 }),
	longDescription: text('long_description'),
	kaspaAddress: varchar('kaspa_address', { length: 255 }).notNull(),
	profileImage: text('profile_image'),
	backgroundImage: text('background_image'),
	backgroundColor: varchar('background_color', { length: 7 }).default('#ffffff'),
	foregroundColor: varchar('foreground_color', { length: 7 }).default('#000000'),
	isActive: boolean('is_active').default(true).notNull(),
	viewCount: bigint('view_count', { mode: 'number' }).default(0),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Social links table
export const socials = pgTable('social', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id')
		.references(() => users.id, { onDelete: 'cascade' })
		.notNull(),
	platform: socialPlatformEnum('platform').notNull(),
	url: text('url').notNull(),
	username: varchar('username', { length: 100 }),
	isVisible: boolean('is_visible').default(true).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Sessions table (for Better Auth)
export const sessions = pgTable('session', {
	id: text('id').primaryKey(),
	userId: uuid('user_id')
		.references(() => users.id, { onDelete: 'cascade' })
		.notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

// Accounts table (for OAuth)
export const accounts = pgTable('account', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id')
		.references(() => users.id, { onDelete: 'cascade' })
		.notNull(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	expiresAt: timestamp('expires_at'),
	password: text('password'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
	userPage: one(userPages, {
		fields: [users.id],
		references: [userPages.userId]
	}),
	socials: many(socials),
	sessions: many(sessions),
	accounts: many(accounts)
}));

export const userPagesRelations = relations(userPages, ({ one }) => ({
	user: one(users, {
		fields: [userPages.userId],
		references: [users.id]
	})
}));

export const socialsRelations = relations(socials, ({ one }) => ({
	user: one(users, {
		fields: [socials.userId],
		references: [users.id]
	})
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	})
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id]
	})
}));

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserPage = typeof userPages.$inferSelect;
export type NewUserPage = typeof userPages.$inferInsert;
export type Social = typeof socials.$inferSelect;
export type NewSocial = typeof socials.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type Account = typeof accounts.$inferSelect; 