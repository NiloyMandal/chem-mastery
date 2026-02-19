# 📚 React.js & Tailwind.css Viva Questions - ChemMastery

**Based on actual patterns used in your codebase**

---

## 🎯 REACT.JS - Core Concepts

### 1. **Basics & Fundamentals**

**Q1: What is React and why use it?**

- **Answer**: React is a JavaScript library for building user interfaces using reusable components. Benefits include virtual DOM, component reusability, unidirectional data flow, and large community support.

**Q2: What's the difference between a class component and functional component?**

- **Answer**:
  - **Class**: Uses `class` syntax, has `this` keyword, uses lifecycle methods (`componentDidMount`, etc.)
  - **Functional**: Uses JavaScript functions, uses hooks for state/lifecycle, simpler and preferred now
  - **Your code**: Uses functional components with hooks (e.g., `ChemistryLab.tsx`)

**Q3: What is JSX? Can we use React without JSX?**

- **Answer**: JSX is syntax extension allowing HTML-like code in JavaScript. It compiles to `React.createElement()` calls. Yes, you can use React without JSX, but it's less readable.

**Q4: What is the Virtual DOM and why is it important?**

- **Answer**: Virtual DOM is in-memory representation of real DOM. React compares (diffs) new Virtual DOM with previous, then updates only changed parts. This improves performance.

---

### 2. **Hooks - Core**

**Q5: What are React Hooks? Name the most important ones.**

- **Answer**: Hooks are functions that let you "hook into" React features. Important ones:
  - `useState` - manage state
  - `useEffect` - side effects (API calls, cleanup)
  - `useMemo` - memoize expensive computations
  - `useRef` - direct DOM access
  - `useCallback` - memoize functions
  - `useContext` - access context values

**Q6: Explain `useState` hook with an example from the codebase.**

- **Answer**:

```tsx
const [temperature, setTemperature] = useState(25); // Initial value: 25

// Update state
setTemperature((prev) => Math.max(prev - 1, 25));

// From ChemistryLab.tsx - multiple useState calls:
const [beakerContents, setBeakerContents] = useState<Chemical[]>([]);
const [reactionResult, setReactionResult] = useState<ReactionResult | null>(
  null,
);
const [volume, setVolume] = useState(0);
```

**Q7: What is `useEffect`? Explain dependencies array.**

- **Answer**: Hook for side effects (network requests, subscriptions, DOM updates). Runs after render.
- **Dependencies**:
  - Empty `[]` - runs only once (on mount)
  - Missing - runs after every render (avoid!)
  - `[dep1, dep2]` - runs when dep1/dep2 change
- **Example from ChemistryLab.tsx**:

```tsx
// Runs only when temperature changes
useEffect(() => {
  if (temperature > 25) {
    const timer = setInterval(() => {
      setTemperature((prev) => Math.max(prev - 1, 25));
    }, 2000);
    return () => clearInterval(timer); // Cleanup
  }
}, [temperature]);
```

**Q8: What is `useMemo` and when to use it?**

- **Answer**: Memoizes computed values, preventing recalculation on every render. Use for expensive operations.
- **From PeriodicTable.tsx**:

```tsx
const enRange = useMemo(() => getElectronegativityRange(), []);
const arRange = useMemo(() => getAtomicRadiusRange(), []);

// From ChemistryLab.tsx - calculate mixed color only when dependencies change
const currentColor = useMemo(() => {
  if (reactionResult?.resultHex) return reactionResult.resultHex;
  const hexColors = beakerContents.map((c) => c.hexColor);
  return mixColors(hexColors);
}, [beakerContents, reactionResult]);
```

**Q9: What is `useRef`? How is it different from state?**

- **Answer**:
  - Doesn't cause re-render when updated
  - Persists across renders
  - Returns same object reference
  - Useful for: DOM manipulation, timers, animation frames
- **From OrganicCanvas.tsx**:

```tsx
const svgRef = useRef<SVGSVGElement>(null);
const meshRef = useRef<THREE.Mesh>(null);

// Access DOM directly:
if (meshRef.current) {
    meshRef.current.position.lerp(...);
}
```

**Q10: Explain cleanup function in useEffect with an example.**

- **Answer**: Returned function runs before component unmounts or before effect runs again. Use for cleanup.
- **From ChemistryLab.tsx**:

```tsx
useEffect(() => {
  if (temperature > 25) {
    const timer = setInterval(() => {
      setTemperature((prev) => Math.max(prev - 1, 25));
    }, 2000);

    // Cleanup function - prevent memory leak
    return () => clearInterval(timer);
  }
}, [temperature]);

// From DailyChallenge.tsx:
useEffect(() => {
  if (safetyWarning) {
    const timer = setTimeout(() => setSafetyWarning(null), 5000);
    return () => clearTimeout(timer); // Clear timeout on cleanup
  }
}, [safetyWarning]);
```

---

### 3. **Component Communication**

**Q11: How do you pass data between components?**

- **Answer**:
  1. **Parent to Child**: Props
  2. **Child to Parent**: Callback functions
  3. **Sibling**: Through common parent or state management (Context, Zustand)
  4. **Any component**: Context API or state management library

**Q12: What are Props? How to pass props in your code?**

- **Answer**: Props are read-only data passed from parent to child. Similar to function parameters.
- **From MoleculeViewer.tsx**:

```tsx
function Atom({
  pos,
  elem,
  explosion,
  isHovered,
  onHover,
}: {
  pos: [number, number, number];
  elem: string;
  explosion: number;
  isHovered: boolean;
  onHover: (state: boolean) => void;
}) {
  const config = ELEMENTS[elem] || ELEMENTS["C"];
  // Use props...
}

// Usage:
<Atom
  pos={[0, 0, 0]}
  elem="C"
  explosion={1.5}
  isHovered={hoveredAtom === "C"}
  onHover={(state) => setHoveredAtom(state ? "C" : null)}
/>;
```

**Q13: Can you modify props directly? Why or why not?**

- **Answer**: No, props are read-only. Modifying them violates React's unidirectional data flow. If child needs to change parent state, use callback functions passed as props.

---

### 4. **Conditional Rendering**

**Q14: How do you do conditional rendering in React?**

- **Answer**:
  1. `if/else` statements
  2. Ternary operator: `condition ? true : false`
  3. AND operator: `condition && element`
  4. Switch statement
- **From AttendanceTable.tsx**:

```tsx
{
  isScanning ? "Scanning..." : "Scan QR Code";
}

// From DailyChallenge.tsx:
status === "completed" ? (
  <div>Completed!</div>
) : status === "loading" ? (
  <LoadingSpinner />
) : (
  <Quiz />
);
```

**Q15: What is the AND (&&) operator in JSX?**

- **Answer**: Renders the second element only if first condition is true. Don't use with 0/false.
- **From MoleculeViewer.tsx**:

```tsx
{isHovered && meshRef.current && (
    <Html position={...}>
        <div>Tooltip</div>
    </Html>
)}
```

---

### 5. **Lists & Keys**

**Q16: How do you render lists in React?**

- **Answer**: Use `.map()` to transform array into JSX elements. Always include `key` prop.
- **From DoubtForum.tsx**:

```tsx
{
  filteredPosts.map((post) => (
    <div key={post.id} className="post">
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </div>
  ));
}
```

**Q17: Why is the `key` prop important?**

- **Answer**:
  - Helps React identify which items changed/added/removed
  - Maintains component state in lists
  - Improves performance
  - Without it, React re-renders entire list
- **Best practices**:
  - Use unique, stable IDs (NOT array index)
  - From your code: `key={post.id}`, `key={el.number}`

**Q18: What happens if you use array index as key?**

- **Answer**:
  - Works for static lists only
  - Breaks with reordering, filtering, or adding items
  - Component state gets mixed up
  - Bad for performance

---

### 6. **Event Handling**

**Q19: How do you handle events in React?**

- **Answer**: Add event handlers as props with camelCase names.

```tsx
<button onClick={handleClick}>Click</button>
<input onChange={handleChange} />
<form onSubmit={handleSubmit} />
<div onMouseEnter={handleHover} />
```

**Q20: What is event delegation in React?**

- **Answer**: React uses event delegation - attaches event listeners to root, then routes them. Benefits: performance, dynamic elements.

**Q21: Explain `React.FormEvent` with an example.**

- **Answer**: TypeScript type for form events. Provides type safety for form submissions.
- **From DoubtForum.tsx**:

```tsx
const handlePost = (e: React.FormEvent) => {
  e.preventDefault(); // Prevent page reload
  // Handle form submission
};

<form onSubmit={handlePost}></form>;
```

**Q22: What is `e.preventDefault()`?**

- **Answer**: Stops default browser behavior (form submission reloading page, link navigating, etc.)

**Q23: Explain drag-and-drop event handling from ChemistryLab.tsx**

- **Answer**:

```tsx
const handleDrop = (e: React.DragEvent, chemical: Chemical) => {
  e.preventDefault(); // Allow drop

  // Check volume
  if (volume >= BEAKER_CAPACITY) {
    alert("Beaker is full!");
    return;
  }

  setVolume((prev) => Math.min(prev + 50, BEAKER_CAPACITY));
};

<div onDrop={(e) => handleDrop(e, chemical)} />;
```

---

### 7. **Forms & Input Handling**

**Q24: How do you handle form inputs in React?**

- **Answer**: Make inputs controlled by storing value in state.

```tsx
const [email, setEmail] = useState("");

<input value={email} onChange={(e) => setEmail(e.target.value)} />;
```

**Q25: What's a controlled vs uncontrolled component?**

- **Answer**:
  - **Controlled**: Value managed by React state
  - **Uncontrolled**: Uses DOM to track value (like `<input>` with no onChange)
  - React prefers controlled components

**Q26: Explain FormData usage in AuthPage.tsx**

- **Answer**: Browser API for sending form data. Useful for file uploads and server actions.

```tsx
const formData = new FormData();
formData.append("email", email);
formData.append("password", password);

const result = await login(undefined, formData);
```

---

### 8. **Performance Optimization**

**Q27: What is React.memo and why use it?**

- **Answer**: HOC that memoizes component. Skips re-render if props haven't changed.

```tsx
const AtomDisplay = React.memo(({ atom }) => {
  return <div>{atom.name}</div>;
});
```

**Q28: What is `useCallback`?**

- **Answer**: Memoizes function so you can pass same function reference to child components. Prevents unnecessary re-renders.

```tsx
const handleClick = useCallback(() => {
  // Do something
}, [dependency]); // Dependencies array
```

**Q29: How many times does a component re-render?**

- **Answer**: When:
  - State changes
  - Parent re-renders (and props change)
  - Context value changes
  - Keys change (in lists)

**Q30: What is the "key" prop performance benefit?**

- **Answer**: Helps React identify which items changed. Without good keys, React re-renders entire list.

---

### 9. **Next.js Specific**

**Q31: What is `'use client'` directive?**

- **Answer**: Marks component as Client Component. Enables hooks, event listeners, browser APIs.
- **All your components have this** (required for interactive features)

**Q32: What is the difference between Server and Client Components?**

- **Answer**:
  - **Server**: Render on server, send HTML. No hooks, no events
  - **Client**: Render on client, interactive. Uses hooks
  - Your app uses Client Components for everything

**Q33: What is `useRouter` from Next.js?**

- **Answer**: Hook for programmatic navigation.
- **From PeriodicTable.tsx**:

```tsx
const router = useRouter();

const navigateToElement = (elementId) => {
  router.push(`/chemistry/element/${elementId}`);
};
```

**Q34: What is Next.js App Router?**

- **Answer**: File-based routing system. File structure = URL structure.
- **Your app**:
  - `app/page.tsx` → `/`
  - `app/student/page.tsx` → `/student`
  - `app/(auth)/login/page.tsx` → `/login`

**Q35: What is the difference between `next/navigation` and `react-router`?**

- **Answer**:
  - **Next.js Router**: Built into Next.js, optimized, uses file-based routing
  - **React Router**: 3rd party library, component-based routing, more flexible
  - Next.js is recommended for Next.js projects

---

### 10. **State Management**

**Q36: What is Context API?**

- **Answer**: React feature for managing global state without passing props through every component.
- **From your code**: SessionProvider.tsx uses Context for auth state

**Q37: How do you create and use Context?**

- **Answer**:

```tsx
const MyContext = React.createContext<Type | undefined>(undefined);

// Provider component
export const MyContextProvider = ({ children }) => {
  const [value, setValue] = useState(initialValue);
  return (
    <MyContext.Provider value={{ value, setValue }}>
      {children}
    </MyContext.Provider>
  );
};

// Use context
const MyContext = useContext(MyContext);
```

**Q38: Your code uses Zustand. What is it?**

- **Answer**: Lightweight state management library (alternative to Redux). Used in your project dependencies.
- Benefits: Simpler than Redux, less boilerplate

**Q39: What's the difference between useState and Context for state?**

- **Answer**:
  - **useState**: Local component state
  - **Context**: Global state shared across components
  - Use useState for component-local state, Context for app-wide state

**Q40: How do you avoid prop drilling?**

- **Answer**: Use Context API or state management library (Zustand, Redux) to pass state without threading through every component.

---

### 11. **Type Safety (TypeScript)**

**Q41: Why use TypeScript with React?**

- **Answer**: Type safety prevents bugs, improves IDE support, better documentation, easier refactoring.

**Q42: How do type props in React components?**

- **Answer**:

```tsx
interface AtomProps {
  pos: [number, number, number];
  elem: string;
  isHovered: boolean;
  onHover: (state: boolean) => void;
}

function Atom({ pos, elem, isHovered, onHover }: AtomProps) {
  // Component body
}
```

**Q43: What is `React.ReactNode`?**

- **Answer**: Type for anything that can be rendered (elements, strings, numbers, fragments).

```tsx
interface Props {
  children: React.ReactNode;
}
```

**Q44: What are generic types in TypeScript? Example from your code.**

- **Answer**: Allow reusable types with dynamic type parameter.

```tsx
useState<Chemical[]>([]); // State holds array of Chemical
useState<ReactionResult | null>(null); // State holds ReactionResult or null

// From MoleculeViewer.tsx:
const meshRef = useRef<THREE.Mesh>(null); // useRef typed to THREE.Mesh
```

---

### 12. **Common Patterns & Mistakes**

**Q45: What is the stale closure problem?**

- **Answer**: Function captures stale variable value. Common with hooks dependencies.

```tsx
// ❌ Wrong - temperature captured on first render
useEffect(() => {
  setInterval(() => {
    console.log(temperature); // Always logs initial value
  }, 1000);
}, []); // Missing dependency

// ✅ Correct
useEffect(() => {
  setInterval(() => {
    console.log(temperature); // Has latest value
  }, 1000);
}, [temperature]);
```

**Q46: What is infinite loop in useEffect?**

- **Answer**: Effect runs every render, causing re-render, triggering effect again.

```tsx
// ❌ Wrong - causes infinite loop
useEffect(() => {
  setCount(count + 1); // Causes re-render, triggers effect again
});

// ✅ Correct - run only once
useEffect(() => {
  setCount(count + 1);
}, []);
```

**Q47: When should you NOT use hooks?**

- **Answer**:
  - Inside loops, conditions, or nested functions
  - In non-React functions
  - Conditionally

**Q48: What is the "Rules of Hooks"?**

- **Answer**:
  1. Only call hooks at top level (not in loops/conditionals)
  2. Only call hooks in React functions (components or custom hooks)

**Q49: What's wrong with modifying state directly?**

- **Answer**: React doesn't detect change, won't re-render. Always use setState.

```tsx
// ❌ Wrong
state.arr.push(item); // Direct mutation

// ✅ Correct
setState([...state.arr, item]); // New array reference
```

**Q50: Explain `useEffect` dependency gotcha:**

- **Answer**: Pass correct dependencies to avoid stale values or infinite loops.
- **From OptionalCanvas.tsx** - snap logic runs whenever mousePos changes:

```tsx
useEffect(() => {
  // Recalculate snap position when mouse moves
  if (!currentStart) {
    setSnappedPos(null);
    return;
  }
  const dx = mousePos.x - currentStart.x;
  const dy = mousePos.y - currentStart.y;
  // ... calculate snap
}, [mousePos, currentStart]); // Dependencies
```

---

## 🎨 TAILWIND.CSS - Styling

### 1. **Basics & Philosophy**

**Q51: What is Tailwind CSS?**

- **Answer**: Utility-first CSS framework. Compose styles using predefined utility classes instead of writing custom CSS.

**Q52: Utility-first vs Component-first CSS. What's the difference?**

- **Answer**:
  - **Utility-first (Tailwind)**: Use small utility classes (`flex`, `p-4`, `text-red-500`)
  - **Component-first (Bootstrap)**: Pre-built components (`.btn`, `.card`)
  - Tailwind is more flexible, Bootstrap is faster to prototype

**Q53: Why use Tailwind instead of regular CSS?**

- **Answer**:
  - No naming conflicts
  - Smaller production bundle (unused styles removed)
  - Consistency through design system
  - Faster development
  - Easy responsive design
  - No building custom components

**Q54: How does Tailwind reduce bundle size?**

- **Answer**: PurgeCSS/JIT removed unused classes. Build process scans code, includes only used utilities.

---

### 2. **Class Names & Utilities**

**Q55: What are utility classes in Tailwind?**

- **Answer**: Single-purpose classes that apply one CSS property.

```
p-4      → padding: 1rem
m-2      → margin: 0.5rem
text-red-500 → color: #ef4444
bg-blue-600  → background: #2563eb
w-full   → width: 100%
h-screen → height: 100vh
```

**Q56: Explain Tailwind color naming system**

- **Answer**:
  - Colors: red, gray, blue, green, yellow, purple, etc.
  - Shades: 50-950 (light to dark)
  - Examples:
    - `text-red-50` (very light)
    - `text-red-500` (medium)
    - `text-red-900` (very dark)

**Q57: Show examples of responsive classes from your code**

- **Answer**:

```tsx
// From AuthPage.tsx
<div className="hidden lg:flex lg:w-1/2">
  // Hidden on mobile, flex layout on large screens

// From DoubtForum.tsx
<div className="flex flex-col md:flex-row justify-between items-center">
  // Column layout on mobile, row layout on medium+ screens

// From DailyChallenge.tsx
className="w-full md:w-2/3 lg:w-1/2"
```

**Q58: Explain breakpoints in Tailwind**

- **Answer**: Screen size prefixes:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
  - `2xl`: 1536px

---

### 3. **Composition & Classes**

**Q59: What is the `cn()` function in your code?**

- **Answer**: Custom utility combining `clsx` and `tailwind-merge` to:
  1. Combine multiple class strings/objects
  2. Merge conflicting Tailwind classes properly

```tsx
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage:
className={cn(
    "p-4 rounded-lg",
    isFocused && "ring-2 ring-blue-500",
    disabled && "opacity-50"
)}
```

**Q60: What is the difference between `clsx` and `twMerge`?**

- **Answer**:
  - **clsx**: Merges multiple class objects/strings (handles conditionals)
  - **twMerge**: Handles Tailwind-specific conflicts (prevents duplicate properties)
  - Example:

```tsx
clsx("p-4", isLarge && "p-8", { "text-red-500": hasError });
// → "p-4 p-8 text-red-500" (both paddings included!)

twMerge("p-4 p-8");
// → "p-8" (conflicts resolved, uses last)

cn("p-4 p-8", "text-red-500");
// → "p-8 text-red-500" (correctly merged)
```

**Q61: Show an example of conditional Tailwind classes**

- **Answer**:

```tsx
// From AttendanceTable.tsx
className={cn(
    "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
    isScanning ? "bg-green-100 text-green-700 animate-pulse" :
    "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
)}

// From DailyChallenge.tsx
const DIFFICULTY_COLORS = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700',
};

className={DIFFICULTY_COLORS[difficulty]}
```

---

### 4. **Layout & Spacing**

**Q62: What is flexbox in Tailwind?**

- **Answer**: Flexible box layout model. Use flex utilities to create responsive layouts.

```css
flex             /* display: flex */
flex-col         /* flex-direction: column */
flex-row         /* flex-direction: row (default) */
justify-between  /* justify-content: space-between */
items-center     /* align-items: center */
gap-4            /* gap: 1rem */
```

**Q63: Explain spacing units in Tailwind**

- **Answer**: Spacing scale (default 1 = 0.25rem = 4px):

```
p-1 → padding: 0.25rem (4px)
m-4 → margin: 1rem (16px)
gap-8 → gap: 2rem (32px)
w-12 → width: 3rem (48px)
```

**Q64: Show flexbox example from your code**

- **Answer**:

```tsx
// From DoubtForum.tsx - header layout
<div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
  {/* flex: display flex */}
  {/* flex-col: column on mobile */}
  {/* md:flex-row: row on tablets+ */}
  {/* justify-between: space content apart */}
  {/* items-center: vertically center */}
  {/* mb-8: margin bottom */}
  {/* gap-4: space between items */}
</div>;

// From AttendanceTable.tsx - button layout
className = "flex items-center gap-2 px-4 py-2";
{
  /* flex: display flex */
}
{
  /* items-center: vertically center children */
}
{
  /* gap-2: space between icon and text */
}
{
  /* px-4: horizontal padding */
}
{
  /* py-2: vertical padding */
}
```

---

### 5. **Colors, Backgrounds & Borders**

**Q65: How are colors handled in Tailwind?**

- **Answer**: Text, background, border colors. Format: `[type]-[color]-[shade]`

```css
text-red-500      /* text color */
bg-blue-600       /* background */
border-slate-200  /* border */
```

**Q66: Show gradient backgrounds from your code**

- **Answer**:

```tsx
// From AuthPage.tsx
className="bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700"
    /* Gradient: top-left to bottom-right */
    /* Colors: indigo → purple → violet */

// Text gradient (using bg-clip-text)
<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-300">
    Master Chemistry
</span>
```

**Q67: Explain shadow and rounded utilities**

- **Answer**:

```css
rounded     /* border-radius: 0.25rem */
rounded-lg  /* border-radius: 0.5rem */
rounded-full /* border-radius: 9999px (circles) */

shadow-sm   /* small shadow */
shadow     /* medium shadow */
shadow-lg   /* large shadow */
shadow-2xl  /* extra large shadow */

/* With transitions: */
hover:shadow-lg    /* larger shadow on hover */
```

**Q68: Show border examples from your code**

- **Answer**:

```tsx
// From AttendanceTable.tsx
className = "rounded-2xl shadow-sm border border-slate-200";
/* rounded-2xl: larger border radius */
/* shadow-sm: subtle shadow */
/* border: 1px border */
/* border-slate-200: light gray border color */

// From PeriodicTable.tsx
className = "border-2 border-slate-300";
/* 2px border, light gray */
```

---

### 6. **Typography & Text**

**Q69: Explain text utilities in Tailwind**

- **Answer**:

```css
text-sm      /* font-size: 0.875rem */
text-base    /* font-size: 1rem */
text-lg      /* font-size: 1.125rem */
text-2xl     /* font-size: 1.5rem */

font-medium  /* font-weight: 500 */
font-bold    /* font-weight: 700 */

text-center  /* text-align: center */
text-red-500 /* color */
```

**Q70: Show typography example from your code**

- **Answer**:

```tsx
// From DoubtForum.tsx
<h1 className="text-3xl font-bold text-slate-800">Doubt Forum</h1>
    /* text-3xl: large heading size */
    /* font-bold: thick text */
    /* text-slate-800: dark gray color */

<p className="text-sm text-slate-500">Ask questions, get answers</p>
    /* text-sm: small text */
    /* text-slate-500: medium gray */
```

---

### 7. **Pseudo-classes & States**

**Q71: What are Tailwind pseudo-classes?**

- **Answer**: Utilities for different element states:

```css
hover:bg-blue-700      /* on hover */
focus:ring-2           /* on focus */
active:scale-95        /* when pressed */
disabled:opacity-50    /* when disabled */
first:mt-0             /* first child */
last:pb-0              /* last child */
odd:bg-gray-50         /* odd items */
```

**Q72: Show hover and focus states from your code**

- **Answer**:

```tsx
// From DoubtForum.tsx - button
className = "hover:bg-indigo-700 transition-all";
/* hover:bg-indigo-700: darker on hover */

// From AttendanceTable.tsx - input
className = "focus:outline-none focus:ring-2 focus:ring-blue-500";
/* focus:outline-none: remove browser outline */
/* focus:ring-2: add border ring on focus */
/* focus:ring-blue-500: ring color */
```

**Q73: What is `transition` in Tailwind?**

- **Answer**: Enables smooth CSS transitions for state changes.

```css
transition          /* Add smooth transition */
transition-all      /* Transition all properties */
transition-colors   /* Only transition color changes */
duration-200        /* Duration: 200ms */
ease-in-out        /* Easing function */
```

---

### 8. **Animations & Transforms**

**Q74: What are animation utilities in Tailwind?**

- **Answer**:

```css
animate-spin        /* Rotating animation */
animate-pulse       /* Fading in/out */
animate-bounce      /* Bouncing animation */
animate-float       /* Custom animation (if defined) */

transform           /* Enable transforms */
scale-95            /* Scale: 95% */
translate-x-4       /* Move X axis */
rotate-90           /* Rotate 90 degrees */
```

**Q75: Show animation example from your code**

- **Answer**:

```tsx
// From AuthPage.tsx
<div className="animate-spin-slow">
    <Atom className="w-8 h-8" />
</div>

// From AttendanceTable.tsx - scanning state
className="bg-green-100 text-green-700 animate-pulse"
    /* animate-pulse: fade in/out effect while scanning */

// From AuthPage.tsx - floating divs
<div className="animate-float" />
<div className="animate-float delay-200" />
    /* Multiple elements with staggered animation */
```

**Q76: What is `delay-*` in Tailwind?**

- **Answer**: Adds delay before animation starts.

```css
delay-100 /* animation-delay: 100ms */
delay-200 /* animation-delay: 200ms */
```

---

### 9. **Opacity & Advanced**

**Q77: How to control opacity in Tailwind?**

- **Answer**:

```css
opacity-0    /* opacity: 0 (invisible) */
opacity-50   /* opacity: 0.5 */
opacity-100  /* opacity: 1 (fully visible) */
bg-slate-50/50  /* 50% opacity background */
```

**Q78: Explain grayscale and filters**

- **Answer**:

```css
grayscale         /* Convert to grayscale */
grayscale-0       /* No grayscale */
blur-sm           /* Blur effect */
```

**Q79: Show opacity usage from your code**

- **Answer**:

```tsx
// From PeriodicTable.tsx - dimming non-matching elements
searchQuery && !isMatch(el) ? "opacity-20 grayscale" : "opacity-30";

// From AttendanceTable.tsx - disabled button
disabled && "opacity-50";

// From AuthPage.tsx - animated background
className = "bg-white/10 backdrop-blur-sm";
/* 10% opacity white with blur effect */
```

---

### 10. **Responsive Design**

**Q80: What are Tailwind breakpoints?**

- **Answer**:
  | Breakpoint | Width | Prefix |
  |-----------|-------|--------|
  | Mobile | < 640px | (none) |
  | Small | ≥ 640px | sm: |
  | Medium | ≥ 768px | md: |
  | Large | ≥ 1024px | lg: |
  | Extra Large | ≥ 1280px | xl: |
  | 2XL | ≥ 1536px | 2xl: |

**Q81: Show a complete responsive layout from your code**

- **Answer**:

```tsx
// From AuthPage.tsx - responsive split screen
<div className="min-h-screen flex">
    {/* Container: full height, flex layout */}

    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br">
        {/* Hidden on mobile, 50% width on desktop (lg+) */}
    </div>

    <div className="w-full lg:w-1/2 flex items-center justify-center">
        {/* Full width on mobile, 50% on desktop */}
    </div>
</div>

// From DoubtForum.tsx - responsive flex
<div className="flex flex-col md:flex-row justify-between items-center gap-4">
    {/* Column on mobile, row on tablet+ */}
</div>
```

**Q82: How to show/hide elements on specific breakpoints?**

- **Answer**:

```css
hidden          /* display: none */
block           /* display: block */
lg:flex         /* display: flex on large+ screens */
md:hidden       /* hidden on medium+ screens */
lg:inline       /* inline on large+ screens */
```

---

### 11. **Advanced Patterns**

**Q83: What is `bg-[url(...)]` syntax?**

- **Answer**: Arbitrary values in square brackets to use custom values not in config.
- **From AuthPage.tsx**:

```tsx
className = "bg-[url('data:image/svg+xml;base64,...')]";
/* Custom SVG pattern as background */
```

**Q84: How to create custom animations?**

- **Answer**: Extend Tailwind config:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
    },
  },
};
```

**Q85: What is `@apply` directive in Tailwind CSS?**

- **Answer**: Extract component-specific styles in CSS files.

```css
@layer components;
.btn {
  @apply px-4 py-2 rounded-lg font-bold transition-all;
}
.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}
```

---

### 12. **Performance & Best Practices**

**Q86: How does Tailwind optimize CSS in production?**

- **Answer**: PurgeCSS/JIT removes unused classes during build, drastically reducing final CSS.

**Q87: Should you write custom CSS with Tailwind?**

- **Answer**: Rarely. Tailwind covers 95% of cases. Write custom CSS only for:
  - Complex animations
  - Non-standard values
  - Reusable component styles (@apply)

**Q88: How to avoid Tailwind class name hell?**

- **Answer**:
  1. Use the `cn()` utility function
  2. Break complex className into objects
  3. Use `@apply` for repeated patterns
  4. Organize classes logically

**Q89: Show best practice: managing long class strings**

- **Answer**:

```tsx
// ❌ Hard to read
className="flex items-center justify-between p-6 border-b border-slate-100 gap-2"

// ✅ Better - use constants
const cardHeaderClasses = "flex items-center justify-between p-6 border-b border-slate-100";
const gapClasses = "gap-2";

className={`${cardHeaderClasses} ${gapClasses}`}

// ✅ Best - use cn()
className={cn(
    "flex items-center justify-between",
    "p-6 border-b border-slate-100",
    "gap-2"
)}
```

**Q90: What is CSS-in-JS vs Tailwind?**

- **Answer**:
  - **CSS-in-JS** (Styled Components): CSS in JavaScript, runtime overhead
  - **Tailwind**: Pre-built utilities, compiled CSS, zero runtime, smaller bundle
  - Tailwind is generally better for production performance

---

## 🤝 ReactJS + Tailwind.css - Integration

**Q91: How to structure components with Tailwind in React?**

- **Answer**: Keep styling in component className attributes, state determines conditions.

```tsx
export default function Button({ variant = "primary", disabled, children }) {
  return (
    <button
      disabled={disabled}
      className={cn(
        "px-4 py-2 rounded-lg font-medium transition-all",
        variant === "primary"
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-gray-200 text-gray-800 hover:bg-gray-300",
        disabled && "opacity-50 cursor-not-allowed",
      )}>
      {children}
    </button>
  );
}
```

**Q92: How to theme your React + Tailwind app?**

- **Answer**:
  1. Use CSS variables + Tailwind config
  2. Use Context for theme switching
  3. Use tailwind.config.js to customize colors

**Q93: Best practice: component extraction from template**

- **Answer**: Extract reusable styled elements into separate components.

```tsx
// components/Card.tsx
export const Card = ({ children, className }) => (
  <div
    className={cn(
      "rounded-lg shadow-md border border-slate-200 p-6",
      className,
    )}>
    {children}
  </div>
);

// Usage:
<Card className="bg-blue-50">Content</Card>;
```

---

## 💡 **Scenario-Based Questions**

**Q94: How would you build a form with React + Tailwind?**

- **Answer**:

```tsx
export default function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send form data
    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6">
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all">
        Submit
      </button>
      {submitted && <p className="text-green-500 mt-4">Thank you!</p>}
    </form>
  );
}
```

**Q95: How to create a responsive navigation bar?**

- **Answer**:

```tsx
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-xl font-bold">ChemMastery</h1>

          {/* Mobile menu button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            Menu
          </button>

          {/* Desktop menu */}
          <ul className="hidden md:flex gap-6">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>

          {/* Mobile menu */}
          {isOpen && (
            <ul className="absolute top-16 left-0 right-0 bg-white border-t md:hidden">
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/about">About</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
```

---

## 🎓 **Expected Questions in Viva**

Based on your codebase, expect questions on:

1. **React Hooks**: useState, useEffect, useMemo, useRef
2. **Component Patterns**: Prop drilling, component composition
3. **State Management**: Using hooks, Context
4. **Performance**: Memoization, dependencies
5. **Event Handling**: Drag-drop, forms, validation
6. **Tailwind Utilities**: Responsive design, dark mode, animations
7. **TypeScript**: Interface typing, generic types
8. **Next.js**: 'use client', useRouter, App Router
9. **Real-world scenarios**: Building features like yours
10. **Code patterns**: Using `cn()`, conditional classes

---

## 📚 **Resources to Study**

- **React Docs**: react.dev
- **Tailwind Docs**: tailwindcss.com
- **Next.js Docs**: nextjs.org
- **Your Code**: Review ChemistryLab.tsx, MoleculeViewer.tsx for patterns

---

**Total Questions Covered: 95+ with detailed explanations and code examples**

Good Luck with your Viva! 🎯
