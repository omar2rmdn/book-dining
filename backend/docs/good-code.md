# Clarity Over Abstraction

## Core Philosophy

Write code for humans first.

Every abstraction has a cost. Before extracting code, ask whether it actually makes the code easier to understand today—not whether it _might_ become useful someday.

Optimize for **reading**, not writing.

The best code is often the code that requires the fewest mental jumps.

---

# Guiding Principles

Prioritize, in order:

1. Clarity
2. Readability
3. Maintainability
4. Simplicity
5. Reusability
6. Abstraction (only when justified)

A small amount of duplication is almost always preferable to unnecessary abstraction.

---

# Prefer

- straightforward code
- inline logic when it remains readable
- descriptive variable names
- explicit control flow
- local reasoning
- self-explanatory code
- functions that tell a clear story
- code that can be understood without jumping between files

A reader should understand a piece of code from top to bottom without constantly navigating elsewhere.

---

# Avoid

Do **NOT** introduce abstraction simply because it feels "clean."

Avoid:

- tiny helper functions
- wrapper utilities
- unnecessary custom hooks
- generic utility functions
- configuration layers
- needless constants
- one-line functions
- "future-proof" abstractions
- over-engineered architecture
- excessive indirection
- unnecessary interfaces or types
- splitting simple logic into multiple files
- abstractions used only once

Do not optimize for hypothetical future reuse.

Optimize for today's readability.

---

# Inline Simple Logic

Prefer:

```ts
const formattedName = `${user.firstName} ${user.lastName}`;
```

Instead of:

```ts
const createUserDisplayName = (user) => `${user.firstName} ${user.lastName}`;

const formattedName = createUserDisplayName(user);
```

---

Prefer:

```ts
const isAdmin = user.role === "admin" || user.role === "owner";
```

Instead of:

```ts
const hasAdministrativePrivileges = (user) =>
  user.role === "admin" || user.role === "owner";

const isAdmin = hasAdministrativePrivileges(user);
```

---

# Avoid Unnecessary Constants

Don't create constants that simply rename obvious literals.

Bad:

```ts
const BUTTON_BACKGROUND = "#2563eb";

style={{
  backgroundColor: BUTTON_BACKGROUND,
}}
```

Good:

```ts
style={{
  backgroundColor: "#2563eb",
}}
```

Constants should represent:

- business concepts
- shared values
- domain rules
- values likely to change together

Not every string deserves a name.

---

# Avoid Wrapper Functions

Bad:

```ts
function navigateToProfile() {
  router.push("/profile");
}

navigateToProfile();
```

Good:

```ts
router.push("/profile");
```

---

Bad:

```ts
function closeModal() {
  setOpen(false);
}
```

Good:

```ts
setOpen(false);
```

---

# Avoid Single-Use Utilities

Bad:

```
utils/
    formatPrice.ts
```

```ts
// used exactly once
```

Good:

Keep the formatting next to where it is used.

---

# Avoid Premature Custom Hooks

Don't extract hooks simply because React allows it.

Bad:

```ts
const isLoading = useLoadingState();
```

when the implementation is:

```ts
const [isLoading, setIsLoading] = useState(false);
```

If logic isn't shared or complex, leave it in the component.

---

# Keep Logic Close To Usage

Prefer:

```ts
const filteredUsers = users.filter((user) => user.active);
```

instead of

```ts
const filteredUsers = getActiveUsers(users);
```

when `getActiveUsers` is only:

```ts
return users.filter((user) => user.active);
```

The reader shouldn't need to jump elsewhere to understand one obvious line.

---

# Extract Only When It Adds Value

Extraction is encouraged only when it:

- meaningfully reduces duplication
- isolates complex business rules
- improves readability
- creates a genuinely reusable unit
- simplifies testing of important logic
- separates unrelated responsibilities
- hides implementation complexity
- improves naming of a difficult concept

If extraction only replaces one obvious line with another function name, it probably isn't worth it.

---

# Prefer Concrete Code

Bad:

```ts
executeUserTransformation(user);
```

Good:

```ts
const sanitizedUser = {
  ...user,
  email: user.email.trim().toLowerCase(),
};
```

Concrete code is easier to understand than vague abstractions.

---

# Keep Components Understandable

A component should read like a story.

Good:

```tsx
return (
  <>
    <Header />

    <UserProfile user={user} />

    <Button onClick={handleSave}>Save</Button>
  </>
);
```

Avoid hiding every JSX block inside helper render functions unless they are reused or genuinely improve readability.

---

# Prefer Explicit Branches

Good:

```ts
if (!user) {
  return null;
}

if (!user.isAdmin) {
  return <AccessDenied />;
}

return <Dashboard />;
```

Instead of deeply nested conditions.

Early returns reduce cognitive load.

---

# Name Things Well

Good names reduce the need for abstraction.

Prefer:

```ts
const unpaidInvoices = invoices.filter((invoice) => !invoice.paid);
```

over:

```ts
const result = process(invoices);
```

Clear names eliminate unnecessary comments.

---

# Keep Files Reasonably Sized

Avoid splitting code solely to make files shorter.

One cohesive 400-line file is often easier to understand than ten interconnected 40-line files.

Split files when they represent different responsibilities, not arbitrary size limits.

---

# Comments

Write code that rarely needs comments.

Use comments only to explain:

- business rules
- non-obvious decisions
- external constraints
- important tradeoffs

Do not comment what the code already says.

Bad:

```ts
// Increment count
count++;
```

Good:

```ts
// API returns null instead of an empty array for legacy reasons.
```

---

# DRY Is Not Absolute

Do not chase perfect DRY.

Sometimes repeating three simple lines is clearer than introducing an abstraction.

Prefer readable duplication over confusing reuse.

---

# Optimize for Local Reasoning

A developer should be able to understand a function without opening five other files.

Every jump between files increases cognitive load.

Keep related logic together whenever practical.

---

# Rule of Three

Don't abstract after the first duplication.

Usually wait until code has naturally repeated multiple times before introducing reusable abstractions.

Patterns emerge with usage—not prediction.

---

# Before Extracting Code, Ask Yourself

- Is this actually reused?
- Does extraction make the code easier to read?
- Will someone understand this faster?
- Does this hide complexity or merely relocate it?
- Is the abstraction naming a real domain concept?
- Would an experienced developer inline this instead?

If the answer to most of these is "no," keep the code inline.

---

# The Goal

Write code that someone can understand six months later without opening five helper files.

The best abstraction is often no abstraction at all.

Favor explicitness over cleverness.

Favor readability over indirection.

Favor today's simplicity over tomorrow's hypothetical flexibility.

Write code that feels obvious.
