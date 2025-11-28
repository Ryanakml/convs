# shadcn/ui monorepo template

This template is for creating a monorepo with shadcn/ui.

## Usage

```bash
pnpm dlx shadcn@latest init
```

## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

## Tailwind

Your `tailwind.config.ts` and `globals.css` are already set up to use the components from the `ui` package.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/ui/components/button";
```

### Widget-chat-screen.tsx

// This script will create the chat interface that user can interact with bot and chat with agent. key feature is user can send massage, show loading while waiting for response, and then auto scroll to bottom when new message arrives.

// tools and dependencies, here we will using reacthooks, reacthooks is just a special funstion react have to make us be able to make our components or function have state or memory, can understand effect or changes, and can access special things like context. more simple is reacthooks is a special function react have that give a function or component a ability to store a state (changes value), react to changes (effects) and access all kind of special react things or function.

// Use state. This is a hooks or react special function that allow react to store a value that can be changed, and everytime it changed, it will be rerender and the ui updated automatically with new values as the part if functional of that special function. then why we need this?, react function didnt have memory, if we use traditional function, everytime we render again, the valiu will be restart again. for example, if we need to store the messages that user send and the bot or agent reply, so we need a place to store it, and useState is perfect for that. so we will use useState to store the messages. soo, its like telling react, hey react can you store this value in memory internal so id i change it later, you will remember it and update the ui accordingly. The process of how react do this is basically just react put the value in memory internal, then react will give us that value again and function to update that value and automatically update it, rerender, and update the ui.

// Use Ref. This is another hooks or react special function that the purpose is similar to useState, but the difference is useRef is used to store a value that we dont want to trigger a rerender when the value is changed. so its like telling react, hey react can you store this value in internal memory, but when i change it later, dont rerender or update the ui. just remember it in your memory for me. the very easy example is previos value. for example at our project case. we need to know the previous messages to compare with the new messages that arrive, so we can do something when new messages arrive. so we can use useRef to store the previous messages, so when new messages arrive, we can compare it with the previous messages stored in useRef without triggering a rerender. so its perfect for that.

// Use Effect. This is another react hooks or special function that is very simple, its just a way to tell react, hey react when this value change, can you run this function for me. so the function is triggered if certain value change and we expected to do something when that value change. for example, in our project case, we want to scroll to bottom when new messages arrive, so we can use useEffect to tell react, hey react when the messages value change, can you run this function to scroll to bottom for me. so everytime the messages value change, the function will be triggered and scroll to bottom will be executed. so its perfect for that.

// Jotai. this is a state management library that allow us to store global state that can be accessed from any component. its like useState but globally. for our project we use jotai to store the contact session id, that we need to access at page to show it also at backend to store it at database or send it to api. so there is three funciton it provide, useAtomValue for example we want just to show that value to ui, useSetAtom if we want to just update the value temporarily, and useAtom at backend if we want to read and change the value to pass to database.

// Convex, its just a backend to handle serverless database, thats it. so we can use useQuery to read data from database, usePaginationQuery to read data but with chunk, and useAction to run function to update or insert data to database. for example, at our project, we get data message that long with usePaginationQuery, using useQuery to take contact session id, and useAction to add constact session to database.

// UI Components, a component that already build and styled. for example text area for ui user input and its functionalltiy to handle input by saved input and add to database for example, button to trigger action when clicked.
