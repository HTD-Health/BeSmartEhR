# HTD Health CDS Service

HTD Health CDS Service is a Node.js application that implements [Clinical Decision Support (CDS) Hooks](https://cds-hooks.org/) to provide healthcare-related recommendations and insights. This service is a demo app to showcase how to integrate with healthcare systems and provide real-time decision support for clinicians.

## Features

- **CDS Hooks Implementation**: Supports `patient-view`, `order-select`, and `order-sign` hooks.
- **FHIR Integration**: Processes FHIR resources such as [Patient](https://hl7.org/fhir/R4/patient.html), [Bundle](https://hl7.org/fhir/R4/bundle.html), and [MedicationOrder](https://www.hl7.org/fhir/DSTU2/medicationorder.html).
- **Customizable Logging**: Uses [Winston](https://github.com/winstonjs/winston) for structured and customizable logging.
- **Error Handling**: Provides robust error handling.

## Prerequisites

- Node.js (v18 or later)
- npm or yarn
- A working knowledge of FHIR and CDS Hooks standards

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd CDSService
```

2. Install dependencies:

```bash
npm ci
```

3. Build the project:

```bash
npm run build
```

## Configuration

The application uses environment variables for configuration. You can set these variables in your environment or create a `.env` file in the root directory.

## Variable Default Value Description

## Environment Variables

| Variable  | Default Value | Description                                       |
| --------- | ------------- | ------------------------------------------------- |
| PORT      | `3010`        | Port on which the service runs.                   |
| LOG_LEVEL | `info`        | Logging level (e.g., `debug`, `info`, `warn`).    |
| NODE_ENV  | `development` | Environment mode (`development` or `production`). |

## Running the Service

### Development Mode

To run the service in development mode with hot-reloading:

```bash
npm run dev
```

### Production Mode

To run the service in production mode:

```bash
npm start
```

## Endpoints

1. CDS Services Discovery

- **URL**: `/cds-services`
- **Method**: `GET`
- **Description**: Lists all available CDS services.

2. Patient-View Hook

- **URL**: `/cds-services/patient-assessment`
- **Method**: `POST`
- **Description**: Provides routine check recommendations based on patient data.

3. Order-Select Hook

- **URL**: `/cds-services/order-assistant`
- **Method**: `POST`
- **Description**: Informs about medication when selecting orders.

4. Order-Sign Hook

- **URL**: `/cds-services/order-review`
- **Method**: `POST`
- **Description**: Reviews medication orders prior to signature.

5. Health Check

- **URL**: `/health`
- **Method**: `GET`
- **Description**: Returns the status of the service.

## Project Structure

```
CDSService/
├── dist/                  # Compiled JavaScript files
├── src/
│   ├── controllers/       # Business logic for handling hooks
│   ├── middleware/        # Logging and error handling
│   ├── services/          # Reusable service logic
│   ├── config.ts          # Configuration settings
│   └── index.ts           # Application entry point
│   ├── routes.ts          # API routes
│   ├── types.ts           # Type definitions
└── .gitignore             # Ignored files and directories
├── package.json           # Project metadata and scripts
├── tsconfig.json          # TypeScript configuration
```

## Logging

The service uses [Winston](https://github.com/winstonjs/winston) for logging. Logs are categorized by levels (info, warn, error, etc.) and include custom icons for better readability. Logs are output to the console.

## Error Handling

The service includes a global error handler that ensures all errors are logged.

## Linting and Formatting

To lint the code:

```bash
npm run lint
```

To format the code:

```bash
npm run format
```

## Author

HTD Health
