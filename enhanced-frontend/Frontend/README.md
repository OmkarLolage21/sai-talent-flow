# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/4943adc0-1cb5-4c57-9602-84e74c0aaddb

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/4943adc0-1cb5-4c57-9602-84e74c0aaddb) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## UX Consistency / No Dead Buttons

All interactive buttons now either perform their intended navigation/action or provide immediate user feedback via a lightweight toast using the `comingSoon` helper (see `src/lib/comingSoon.ts`). This ensures there are no "dead" or silent UI elements.

Pattern:

```ts
import { comingSoon } from "@/lib/comingSoon";
<Button onClick={() => comingSoon("Export Players")}>Export</Button>;
```

Non-implemented feature buttons are intentionally left visually identical to preserve UI layout, while providing clear feedback. Replace these handlers with real logic as features are built.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/4943adc0-1cb5-4c57-9602-84e74c0aaddb) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
