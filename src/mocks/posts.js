// src/mocks/posts.js
// Mock timeline messages for ZECbook.com. Each post represents a message received by a wallet.

export const mockPosts = [
  {
    id: "p-1001",
    walletAddress: "u1v0en...7xw2kv",
    authorName: "aisha",
    authorAvatar: "/public/sample.png",
    authorJoined: "2025-10-01T00:00:00.000Z",
    title: "Hello Zcashers — testing signed note",
    body:
      "I’m exploring ZECbook.com! This is a mock post representing a message delivered to my wallet. Future versions will fetch from Supabase.",
    createdAt: "2025-10-25T02:15:00.000Z",
    verifiedCount: 2,
    featured: true,
    rankScore: 5,
    replyAddress: "u1v0en...7xw2kv",
    tags: ["twitter", "note"],
  },
  {
    id: "p-1002",
    walletAddress: "u1abc...def456",
    authorName: "AcidBurn",
    authorAvatar: "/public/sample.png",
    authorJoined: "2025-10-03T00:00:00.000Z",
    title: "New wallet verified with OTP",
    body:
      "Verification succeeded. Posting a short update to confirm my account appears verified.",
    createdAt: "2025-11-01T12:00:00.000Z",
    verifiedCount: 3,
    featured: false,
    rankScore: 10,
    replyAddress: "u1abc...def456",
    tags: ["verified"],
  },
  {
    id: "p-1003",
    walletAddress: "u1lmn...xyz890",
    authorName: "Alex",
    authorAvatar: "/public/sample.png",
    authorJoined: "2025-10-05T00:00:00.000Z",
    title: "My first Zcash message",
    body:
      "Posting my first Zcash message via ZECbook.com. Looking forward to replying and signing.",
    createdAt: "2025-11-03T08:30:00.000Z",
    verifiedCount: 1,
    featured: false,
    rankScore: 0,
    replyAddress: "u1lmn...xyz890",
    tags: ["intro"],
  },
  {
    id: "p-1004",
    walletAddress: "u1foo...bar777",
    authorName: "AL3X",
    authorAvatar: "/public/sample.png",
    authorJoined: "2025-10-04T00:00:00.000Z",
    title: "Weekly spotlight",
    body:
      "This is a ranked update appearing in the weekly top list. All styles mirror the directory cards.",
    createdAt: "2025-11-02T16:45:00.000Z",
    verifiedCount: 2,
    featured: false,
    rankScore: 2,
    replyAddress: "u1foo...bar777",
    tags: ["ranked", "weekly"],
  },
  {
    id: "p-1005",
    walletAddress: "u1sdf...ghj555",
    authorName: "alucard",
    authorAvatar: "/public/sample.png",
    authorJoined: "2025-10-10T00:00:00.000Z",
    title: "Unverified note",
    body:
      "A simple unverified note to demonstrate UI states for badges and borders.",
    createdAt: "2025-11-03T10:10:00.000Z",
    verifiedCount: 0,
    featured: false,
    rankScore: 0,
    replyAddress: "u1sdf...ghj555",
    tags: ["note"],
  },
];

export function getMockPosts() {
  // Return a fresh copy to avoid accidental mutations across components
  return mockPosts.map((p) => ({ ...p }));
}