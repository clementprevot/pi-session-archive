import assert from "node:assert/strict";
import { test } from "node:test";

import { cleanName, cwdDirName, relativeTime, tagged } from "../index.ts";

test("cwdDirName encodes a path the way pi's per-cwd session dirs do", () => {
	assert.equal(cwdDirName("relative/path"), "--relative-path--");
	assert.equal(cwdDirName("/home/user/project"), "--home-user-project--");
	assert.equal(cwdDirName("/Users/me/my:dir"), "--Users-me-my-dir--");
});

test("cleanName strips the archive tag and surrounding quotes", () => {
	assert.equal(cleanName("[ARCHIVE] my session"), "my session");
	assert.equal(cleanName('"quoted name"'), "quoted name");
	assert.equal(cleanName(undefined), "(unnamed)");
	assert.equal(cleanName("   "), "(unnamed)");
});

test("tagged is idempotent and does not double the tag", () => {
	assert.equal(tagged("my session"), "[ARCHIVE] my session");
	assert.equal(tagged("[ARCHIVE] my session"), "[ARCHIVE] my session");
	assert.equal(tagged(undefined), "[ARCHIVE]");
});

function minutesAgo(n: number): Date {
	return new Date(Date.now() - n * 60_000);
}

function daysAgo(n: number): Date {
	return new Date(Date.now() - n * 24 * 60 * 60_000);
}

test("relativeTime buckets into just now, minutes, hours, and days", () => {
	assert.equal(relativeTime(new Date()), "just now");
	assert.equal(relativeTime(minutesAgo(5)), "5m ago");
	assert.equal(relativeTime(minutesAgo(90)), "1h ago");
	assert.equal(relativeTime(daysAgo(3)), "3d ago");
});
