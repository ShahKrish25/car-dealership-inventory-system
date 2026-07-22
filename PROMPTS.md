# My AI Interaction Log 🤖 (PROMPTS.md)

Hey there! This file is a log of how I used AI tools (ChatGPT and Google DeepMind's Antigravity) to help me build this Car Dealership Inventory System. 

To be honest, building this whole thing from scratch was a bit daunting, so using AI as a pair-programmer was a lifesaver. I didn't just copy-paste everything, though! I used it mostly to generate boilerplate code, write repetitive tests, and help me figure out some tricky bugs.

---

## 🛠️ The Tools I Used
1. **ChatGPT (GPT-4)**: I mostly used this early on to set up the basic Node.js/Express backend and write the initial Mongoose schemas.
2. **Antigravity (Google DeepMind)**: I used this heavily for the frontend (React/Vite) and fixing a few sneaky bugs later in development.

---

## 📝 Session 1: Getting the Backend Started (ChatGPT)

**My Prompt:**
> "Hey! Can you help me scaffold a Node.js, Express, and TypeScript backend for a car dealership inventory system? I need JWT authentication and a MongoDB connection using Mongoose."

**What it gave me:** 
It gave me the basic `app.ts`, `server.ts`, and a basic `user.model.ts` with bcrypt password hashing. It also wrote some really simple auth routes.

**How I tweaked it:** 
The code it gave me didn't connect to my MongoDB Atlas cluster properly because of some DNS issues. I had to manually add `dns.setServers(["1.1.1.1"])` to fix it. I also decided to switch the dev server from `ts-node-dev` to `tsx` because it's way faster. Lastly, I realized I needed an admin role, so I added a `role` field to the User model.

---

## 📝 Session 2: The Vehicle Schema & Middleware (ChatGPT)

**My Prompt:**
> "Write a Mongoose schema for a Vehicle model. It needs fields for brand, model, category, year, price, fuelType, transmission, mileage, color, and quantity. Don't forget validation!"

**What it gave me:** 
A pretty solid `vehicle.model.ts` file. 

**How I tweaked it:** 
It forgot that you can't have negative cars in inventory 😂. I added a `min: 0` constraint on the quantity and set the default to 1. I also turned on Mongoose timestamps so I know when vehicles are added.

---

## 📝 Session 3: TDD - Writing Tests Before Code (ChatGPT & Antigravity)

I wanted to follow Test-Driven Development (TDD) properly, so I asked the AI to write the tests *before* the controllers were implemented.

**My Prompt (for Auth):**
> "Write Jest tests for POST /api/auth/register and /api/auth/login endpoints. Make sure to test successful registration, duplicate emails, invalid passwords, and missing users."

**My Prompt (for Vehicles):**
> "Write comprehensive Jest tests for the vehicle CRUD routes. I need to cover: public GET requests, admin-only POST/PUT/DELETE, user purchases (which should decrement quantity), out-of-stock errors, admin restocks, and filtering/searching."

**What it gave me:** 
It generated really good test files: `auth.register.test.ts`, `auth.login.test.ts`, and `vehicle.routes.test.ts` (with like 13 test cases!). 

**How I tweaked it:** 
Honestly, the tests were great. Having them written first made writing the actual controllers so much easier because I just had to make the tests turn green.

---

## 📝 Session 4: Building the Controllers (Antigravity)

**My Prompt:**
> "Now, implement the vehicle controller functions to pass those tests: getVehicles (with filtering, searching, sorting, and pagination), createVehicle, updateVehicle, deleteVehicle, purchaseVehicle, and restockVehicle."

**What it gave me:** 
A complete `vehicle.controller.ts` file that passed almost all the tests! 

**How I tweaked it:** 
I realized that having the search logic mixed into the main GET route was getting messy. So, I asked the AI: *"I need a dedicated GET /api/vehicles/search route as specified in the assessment. Can you extract the search logic?"* It quickly added a new `/search` route for me.

---

## 📝 Session 5: The Frontend Grind (Antigravity)

Building the frontend by myself would have taken days, so I leaned on Antigravity a lot here.

**My Prompt:**
> "Design and build a complete React + Vite + TypeScript + Tailwind CSS frontend for the car dealership. Requirements: Login/Register pages, Dashboard showing all vehicles with search/filter, Purchase button (disabled when qty=0), Admin panel for CRUD operations, JWT authentication persisted in localStorage, protected routes, and a dark automotive theme with glassmorphism."

**What it gave me:** 
Basically the entire frontend structure. It generated the Axios instance, the Auth context, the protected routes, and all the React components. It even added a really cool dark glassmorphism theme!

**The Bug I Had To Fix:** 
The AI made a silly mistake in the frontend Auth logic! It tried to use the `useAuth().login()` state function to make the actual API call, which caused a TypeScript error: `Expected 1 arguments, but got 2.` I had to jump in, import the actual API call (`apiLogin`), make the request to get the token, and *then* pass that token to the context state. I also had to fix the `RegisterPage` because it forgot to include the `name` field in the form!

---

## 🧠 Final Reflection

Using AI was an awesome learning experience. Here is what I took away from it:

1. **Planning is everything:** The AI is only as good as the prompt. Taking the time to outline my schema, routes, and UI requirements before asking for code saved me a ton of headaches.
2. **TDD works:** Having the AI write the tests first forced me to think about edge cases (like out-of-stock purchases) early on.
3. **Don't blindly trust the AI:** The frontend authentication bug is a perfect example. The AI confidently wrote code that didn't actually work. I still had to read the code, understand it, and know how React Context and API calls work together to fix it. 

Overall, the AI handled the boilerplate and the CSS styling, which allowed me to focus on the business logic, the architecture, and debugging the tricky parts.
