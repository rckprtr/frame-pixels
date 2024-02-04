# README for Frame-Pixels Web App

## Overview

The Frame-Pixels Web App is a dynamic, interactive web application designed using Next.js that allows users to navigate through different pages, interact with various UI elements, and perform actions such as moving coordinates and painting pixels. This application utilizes the `@farcaster/hub-nodejs` library to integrate with Farcaster's decentralized social networking protocol, offering a unique blend of web functionality with decentralized features.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (version 12.x or later)
- npm (version 6.x or later)

## Installation

To set up the project locally, follow these steps:

1. Clone the repository to your local machine:

```bash
git clone <repository-url>
```

2. Navigate to the project directory:

```bash
cd frame-pixels-web-app
```

3. Install the necessary dependencies:

```bash
npm install
```

4. Create a `.env.local` file in the root of your project and add the following environment variables:

```env
HUB_URL=nemes.farcaster.xyz:2283 # The URL to the Farcaster Hub
BASE_URL=https://frame-pixels-6dnm.vercel.app # The base URL of your application
```

## Running the Application

To run the application in development mode, use the following command:

```bash
npm run dev
```

Navigate to `http://localhost:3000` to view the application in your browser.

## Features

The Frame-Pixels Web App includes the following features:

- **Dynamic UI Navigation:** Navigate through different UI pages such as home, coordinates, and paint pages.
- **Interactive Elements:** Interact with buttons to move coordinates, select colors, and paint pixels.
- **Decentralized Integration:** Utilize Farcaster's decentralized protocol for unique web interactions.

## API Reference

### POST /api/frame

Handles POST requests to dynamically render UI based on user interactions.

**Request Body:**

- `untrustedData`: Contains the `fid` (frame ID) and `buttonIndex` indicating which button was pressed.

**Response:**

- A dynamic HTML response with updated UI elements based on the request.

### `setup()` Function Documentation

#### Overview
The `setup()` function initializes the user interface for a dynamic web application, creating a structured navigation system through various pages, each with specific functionality and interactive elements. This setup is crucial for managing the application's user flow and ensuring a cohesive interaction experience.

#### Functionality
- Initializes the `FrameUI` object.
- Configures navigation through the creation of `FramePage` objects for each distinct page (`start`, `home`, `coords`, `paint`).
- Adds interactive `FrameButton` and specialized buttons (`RouteButton`, `ColorPickerButton`) to pages for navigation and functionality.
- Establishes connections between pages and actions, defining the application's navigational logic and interactive capabilities.

#### Implementation Details

1. **FrameUI Initialization**:
   - A new instance of `FrameUI` is created, serving as the central management system for all UI pages and their routing.

2. **Page Setup**:
   - **Start Page**: A basic entry point where users begin their interaction.
     - A `RouteButton` is added to navigate from the `start` page to the `home` page.
   - **Home Page**: Serves as the central hub, directing to different functionalities.
     - Includes `RouteButton`s for navigation to the `coords` and `paint` pages.
   - **Coords Page**: Allows users to adjust their coordinates within the application.
     - Utilizes `FrameButton`s for directional movement and checks boundaries to prevent out-of-bounds errors.
   - **Paint Page**: Provides users with color selection and painting capabilities.
     - Integrates `ColorPickerButton`s for color selection and a `FrameButton` for applying the selected color to the canvas.

3. **Interactive Elements**:
   - Buttons are added to pages with specific callbacks for interactions, such as moving the user's position or changing colors.
   - `RouteButton`s are used for page navigation, changing the current page within the `FrameUI`.
   - `ColorPickerButton`s extend `FrameButton` functionality, allowing users to select colors for application within the app's functionality.

4. **Return Value**:
   - The fully initialized `FrameUI` instance is returned, ready for use in managing the application's user interface and interactions.

#### Usage
To utilize the `setup()` function within the application:
- Call `setup()` during the initial loading phase of your application to prepare the user interface.
- The returned `FrameUI` instance should be integrated with the application's main event loop or interaction handler to respond to user actions and navigate between different pages based on interactions.


## Contributing

Contributions are welcome! If you'd like to contribute, please fork the repository and create a pull request with your changes. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE) - See the LICENSE file for details.

---

This README provides a basic overview of the Frame-Pixels Web App's setup, features, and contribution guidelines. Adjustments may be necessary to fit the exact requirements of your project or environment.