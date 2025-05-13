# Practitioner App

A SMART on FHIR application that enables healthcare practitioners to manage and view patient questionnaires and form responses.

## Overview

The Practitioner App is a React-based web application that integrates with Electronic Health Record (EHR) systems through the SMART on FHIR standard. It allows practitioners to:

-   View patient information
-   Assign questionnaires to patients
-   Review completed questionnaires
-   Track patient goals and conditions

### Features

-   **SMART on FHIR Integration**: Launch directly from an EHR system or standalone
-   **Patient Context**: Automatic loading of patient information
-   **Form Management**: Assign, view, and track forms for patients
-   **Responsive UI**: Material UI based interface for desktop and mobile use

## Prerequisites

-   Node.js (v16+)
-   npm or yarn
-   Access to a FHIR server for development and testing

## Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/BeSmartEhR.git
cd BeSmartEhR/practitioner-app
```

Create a `.env` file based on `.env.example`:

```
# .env

VITE_APP_CLIENT_ID=your_client_id
VITE_APP_CLIENT_SCOPE=patient/*.read launch/patient
VITE_APP_REDIRECT_URI=http://localhost:3010/
```

## Development

Start the development server:

```bash
npm start
```

This will run the app in development mode. Open http://localhost:3010 to view it in your browser.
This will also run the logging server. It will be open on http://localhost:3011.

## Project Structure

```
practitioner-app/
├── public/                 # Static assets
├── src/
│   ├── api/                # FHIR client and API interactions
│   ├── components/         # Reusable UI components
│   ├── launch_wrappers/    # SMART launch context handlers
│   ├── pages/              # Application views and pages
│   └── index.ts            # Application entry point
│   ├── routes.ts           # API routes
└── .gitignore              # Ignored files and directories
├── server.js               # Logging server (receive & save)
├── package.json            # Project metadata and scripts
├── tsconfig.json           # TypeScript configuration
```

## Dependencies

-   React - UI framework
-   Material UI - Component library
-   fhirclient - SMART on FHIR client library
-   fhir-questionnaire-json-schema - Converts FHIR questionnaires to JSON schema

## License

[Your license information here]
